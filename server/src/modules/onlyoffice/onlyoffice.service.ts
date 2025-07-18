import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OnlyofficeService {
  private readonly onlyofficeUrl: string;
  private readonly apiBaseUrl: string;
  private readonly apiPort: string;
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.onlyofficeUrl = this.configService.get('ONLYOFFICE_URL');
    this.apiBaseUrl = this.configService.get('API_BASE_URL');
    this.apiPort = this.configService.get('PORT');

    this.jwtSecret = this.configService.get('ONLYOFFICE_JWT_SECRET');
  }

  /**
   * 生成JWT token
   */
  private generateJwtToken(payload: any): string {
    return jwt.sign(payload, this.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  }

  /**
   * 生成文件预览配置
   */
  generateEditorConfig(fileUrl: string, mode: 'view' | 'edit' = 'view') {
    const documentKey = this.generateDocumentKey(fileUrl);
    const fileType = fileUrl.split('.').pop();

    const config = {
      document: {
        fileType: fileType,
        key: documentKey,
        title: fileUrl,
        url: fileUrl,
        permissions: {
          edit: mode === 'edit',
          print: true,
          download: true,
          comment: mode === 'edit',
          review: mode === 'edit',
        },
      },
      documentType: this.getDocumentType(fileType),
      editorConfig: {
        mode: mode,
        lang: 'zh-CN',
        // callbackUrl: `${this.apiBaseUrl}:${this.apiPort}/api/onlyoffice/callback/${fileId}`,
        callbackUrl: '',
        user: {
          id: 'anonymous',
          name: 'Anonymous User',
        },
        customization: {
          autosave: true,
          forcesave: false,
          compactToolbar: false,
          toolbarNoTabs: false,
        },
      },
      height: '100%',
      width: '100%',
      type: 'desktop',
    };

    // 生成JWT token
    const token = this.generateJwtToken(config);

    // 将token添加到配置中
    const configWithToken = {
      ...config,
      token: token,
    };

    return configWithToken;
  }

  /**
   * 生成文档唯一标识
   */
  private generateDocumentKey(fileUrl: string): string {
    const timestamp = Date.now().toString();
    const hash = crypto
      .createHash('md5')
      .update(fileUrl + timestamp)
      .digest('hex');
    return hash;
  }

  /**
   * 根据文件类型获取文档类型
   */
  private getDocumentType(fileType: string): string {
    const wordTypes = ['doc', 'docx', 'txt', 'rtf', 'odt'];
    const cellTypes = ['xls', 'xlsx', 'csv', 'ods'];
    const slideTypes = ['ppt', 'pptx', 'odp'];

    if (wordTypes.includes(fileType.toLowerCase())) {
      return 'word';
    } else if (cellTypes.includes(fileType.toLowerCase())) {
      return 'cell';
    } else if (slideTypes.includes(fileType.toLowerCase())) {
      return 'slide';
    }
    return 'word';
  }

  /**
   * 验证JWT token
   */
  verifyJwtToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid JWT token: ' + error);
    }
  }

  /**
   * 处理 OnlyOffice 回调
   */
  async handleCallback(fileId: string, body: any) {
    // 验证JWT token（如果存在）
    const authHeader = body.token || body.jwt;
    if (authHeader) {
      try {
        this.verifyJwtToken(authHeader);
      } catch (error) {
        console.error('JWT验证失败:', error);
        return { error: 1, message: 'Invalid token' };
      }
    }

    const { status, url, key } = body;
    void key;

    // 状态码说明：
    // 0 - 无文档
    // 1 - 文档编辑中
    // 2 - 文档准备保存
    // 3 - 文档保存出错
    // 4 - 文档已关闭，无变化
    // 6 - 文档编辑中，但当前用户已保存
    // 7 - 强制保存时出错

    if (status === 2 || status === 3) {
      // 文档需要保存
      if (url) {
        // 这里应该从 OnlyOffice 下载文件并保存
        // 实际项目中需要实现文件下载和保存逻辑
        console.log(`需要保存文件 ${fileId}，下载地址：${url}`);
      }
    }

    return { error: 0 };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileInfo {
  id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadTime: Date;
  path: string;
}

@Injectable()
export class FilesService {
  private readonly uploadDir: string;
  private readonly files: Map<string, FileInfo> = new Map();

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD__DIR', './uploads');
    this.ensureUploadDir();
    this.loadExistingFiles();
  }

  /**
   * 确保上传目录存在
   */
  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 加载已存在的文件
   */
  private loadExistingFiles() {
    try {
      const files = fs.readdirSync(this.uploadDir);
      files.forEach((fileName) => {
        const filePath = path.join(this.uploadDir, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          const fileId = uuidv4();
          const fileType = path.extname(fileName).substring(1);
          const fileInfo: FileInfo = {
            id: fileId,
            originalName: fileName,
            fileName: fileName,
            fileType: fileType,
            size: stats.size,
            uploadTime: stats.mtime,
            path: filePath,
          };
          this.files.set(fileId, fileInfo);
        }
      });
    } catch (error) {
      console.error('加载现有文件失败:', error);
    }
  }

  /**
   * 上传文件
   */
  async uploadFile(file: Express.Multer.File): Promise<FileInfo> {
    const fileId = uuidv4();
    const fileType = path.extname(file.originalname).substring(1);
    const fileName = `${fileId}.${fileType}`;
    const filePath = path.join(this.uploadDir, fileName);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    const fileInfo: FileInfo = {
      id: fileId,
      originalName: file.originalname,
      fileName: fileName,
      fileType: fileType,
      size: file.size,
      uploadTime: new Date(),
      path: filePath,
    };

    this.files.set(fileId, fileInfo);
    return fileInfo;
  }

  /**
   * 获取文件列表
   */
  getFileList(): FileInfo[] {
    return Array.from(this.files.values());
  }

  /**
   * 获取单个文件信息
   */
  getFileInfo(fileId: string): FileInfo {
    const fileInfo = this.files.get(fileId);
    if (!fileInfo) {
      throw new NotFoundException(`文件 ${fileId} 不存在`);
    }
    return fileInfo;
  }

  /**
   * 下载文件
   */
  getFileBuffer(fileId: string): Buffer {
    const fileInfo = this.getFileInfo(fileId);
    if (!fs.existsSync(fileInfo.path)) {
      throw new NotFoundException(`文件 ${fileId} 不存在`);
    }
    return fs.readFileSync(fileInfo.path);
  }

  /**
   * 删除文件
   */
  deleteFile(fileId: string): boolean {
    const fileInfo = this.files.get(fileId);
    if (!fileInfo) {
      return false;
    }

    try {
      if (fs.existsSync(fileInfo.path)) {
        fs.unlinkSync(fileInfo.path);
      }
      this.files.delete(fileId);
      return true;
    } catch (error) {
      console.error('删除文件失败:', error);
      return false;
    }
  }

  /**
   * 检查文件类型是否支持预览
   */
  isPreviewSupported(fileType: string): boolean {
    const supportedTypes = [
      'doc',
      'docx',
      'txt',
      'rtf',
      'odt',
      'xls',
      'xlsx',
      'csv',
      'ods',
      'ppt',
      'pptx',
      'odp',
      'pdf',
    ];
    return supportedTypes.includes(fileType.toLowerCase());
  }
}

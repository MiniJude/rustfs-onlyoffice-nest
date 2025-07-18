import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly jwtSecret: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret = this.configService.get('JWT_SECRET');
  }

  /**
   * 对输入数据进行加密处理
   *
   * @param data 待加密的数据字符串
   * @returns 返回加密后的字符串
   */
  encrypt(data: string): string {
    const hmac = crypto.createHmac('sha256', this.jwtSecret);
    return hmac.update(data).digest('hex');
  }

  /**
   * 验证数据的签名是否匹配
   *
   * @param data 需要验证的数据
   * @param sign 签名
   * @returns 如果签名匹配则返回 true，否则返回 false
   */
  verify(data: string, sign: string): boolean {
    data = this.encrypt(data);
    return data === sign;
  }
}

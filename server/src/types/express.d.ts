// import { Request } from 'express';
import { User } from '@prisma/client';

// 扩展 Express 的 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

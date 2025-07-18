import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseDto } from '@/common/dto/response.dto';
import { StatusCode } from '@/common/enums/status-code.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message;

    // 如果是 class-validator 抛出的 BadRequestException
    if (exception.response && Array.isArray(exception.response.message)) {
      message = exception.response.message[0]; // 只取第一个错误消息
    }

    const responseBody: ResponseDto<null> = {
      code: StatusCode.ERROR,
      message,
      data: null,
    };

    // 统一格式化返回
    response.status(status).json(responseBody);
  }
}

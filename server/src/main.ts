import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ExceptionInterceptor } from '@/common/interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局管道，用于验证请求参数和响应数据
  app.useGlobalPipes(new ValidationPipe());

  // 注册全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  // 注册全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 设置全局前缀
  app.setGlobalPrefix('/api');

  // 启用 CORS
  app.enableCors({
    origin: '*', // 允许所有源
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();

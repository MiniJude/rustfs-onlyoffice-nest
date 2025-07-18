import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CryptoModule } from './crypto/crypto.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { CspMiddleware } from '@/common/middleware/csp.middleware';
import { OnlyofficeModule } from './modules/onlyoffice/onlyoffice.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CryptoModule,
    OnlyofficeModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // 注册中间件
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CspMiddleware).forRoutes('*');
  }
}

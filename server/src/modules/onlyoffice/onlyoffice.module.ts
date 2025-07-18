import { Module } from '@nestjs/common';
import { OnlyofficeController } from './onlyoffice.controller';
import { OnlyofficeService } from './onlyoffice.service';

@Module({
  imports: [],
  controllers: [OnlyofficeController],
  providers: [OnlyofficeService],
  exports: [OnlyofficeService],
})
export class OnlyofficeModule {}

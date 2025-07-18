import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { OnlyofficeService } from './onlyoffice.service';

@Controller('onlyoffice')
export class OnlyofficeController {
  constructor(private readonly onlyofficeService: OnlyofficeService) {}

  /**
   * 获取文件编辑器配置
   */
  @Get('config')
  getEditorConfig(
    @Query('fileUrl') fileUrl: string,
    @Query('mode') mode: 'view' | 'edit' = 'view',
  ) {
    return this.onlyofficeService.generateEditorConfig(fileUrl, mode);
  }

  /**
   * 处理 OnlyOffice 回调
   */
  @Post('callback/:fileId')
  async handleCallback(@Param('fileId') fileId: string, @Body() body: any) {
    return this.onlyofficeService.handleCallback(fileId, body);
  }
}

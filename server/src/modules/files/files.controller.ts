import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * 上传文件
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new HttpException('请选择文件', HttpStatus.BAD_REQUEST);
    }

    const fileInfo = await this.filesService.uploadFile(file);
    return fileInfo;
  }

  /**
   * 获取文件列表
   */
  @Get('list')
  getFileList() {
    const files = this.filesService.getFileList();
    return files;
  }

  /**
   * 获取文件信息
   */
  @Get('info/:fileId')
  getFileInfo(@Param('fileId') fileId: string) {
    const fileInfo = this.filesService.getFileInfo(fileId);
    return fileInfo;
  }

  /**
   * 下载文件
   */
  @Get('download/:fileId')
  downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileInfo = this.filesService.getFileInfo(fileId);
    const fileBuffer = this.filesService.getFileBuffer(fileId);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileInfo.originalName}"`,
    );
    res.setHeader('Content-Length', fileBuffer.length);
    res.send(fileBuffer);
  }

  /**
   * 删除文件
   */
  @Delete(':fileId')
  deleteFile(@Param('fileId') fileId: string) {
    const success = this.filesService.deleteFile(fileId);
    return { success };
  }

  /**
   * 检查文件是否支持预览
   */
  @Get('preview-support/:fileId')
  checkPreviewSupport(@Param('fileId') fileId: string) {
    const fileInfo = this.filesService.getFileInfo(fileId);
    const supported = this.filesService.isPreviewSupported(fileInfo.fileType);
    return { supported };
  }
}

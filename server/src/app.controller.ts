import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello World123!';
  }

  @Get('hello')
  getHello1(): string {
    return 'Hello World1234!';
  }
}

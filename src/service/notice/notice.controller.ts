import { Controller, Get, NotFoundException } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('service/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('modal')
  async getModalNotice() {
    return await this.noticeService.getModalNotice();
  }
}

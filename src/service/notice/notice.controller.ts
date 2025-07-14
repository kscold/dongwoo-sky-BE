import { Controller, Get, NotFoundException, Query, Param } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('service/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async getNotices(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return await this.noticeService.getPublishedNoticesWithPagination(pageNum, limitNum);
  }

  @Get('modal')
  async getModalNotice() {
    return await this.noticeService.getModalNotice();
  }

  @Get('published')
  async getPublishedNotices() {
    return await this.noticeService.getPublishedNotices();
  }

  @Get(':id')
  async getNoticeById(@Param('id') id: string) {
    const notice = await this.noticeService.getPublishedNoticeById(id);
    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return notice;
  }
}

// filepath: /Users/kscold/Desktop/dongwoo-sky-BE/src/notices/notices.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNoticeDto: CreateNoticeDto) {
    try {
      const notice = await this.noticesService.create(createNoticeDto);
      return {
        success: true,
        message: '공지사항이 성공적으로 생성되었습니다.',
        data: notice,
      };
    } catch (error) {
      return {
        success: false,
        message: '공지사항 생성에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    try {
      const notices = await this.noticesService.findAll(page, limit);
      return {
        success: true,
        message: '공지사항 목록을 성공적으로 조회했습니다.',
        data: notices,
      };
    } catch (error) {
      return {
        success: false,
        message: '공지사항 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get('published')
  async findPublished() {
    try {
      const notices = await this.noticesService.findPublished();
      return {
        success: true,
        message: '공개 공지사항을 성공적으로 조회했습니다.',
        data: notices,
      };
    } catch (error) {
      return {
        success: false,
        message: '공개 공지사항 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get('modal')
  async findModal() {
    try {
      const notices = await this.noticesService.findModal();
      return {
        success: true,
        message: '모달 공지사항을 성공적으로 조회했습니다.',
        data: notices,
      };
    } catch (error) {
      return {
        success: false,
        message: '모달 공지사항 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.noticesService.getStats();
      return {
        success: true,
        message: '통계 정보를 성공적으로 조회했습니다.',
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: '통계 정보 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const notice = await this.noticesService.findOne(id);
      return {
        success: true,
        message: '공지사항을 성공적으로 조회했습니다.',
        data: notice,
      };
    } catch (error) {
      return {
        success: false,
        message: '공지사항을 찾을 수 없습니다.',
        error: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    try {
      const notice = await this.noticesService.update(id, updateNoticeDto);
      return {
        success: true,
        message: '공지사항이 성공적으로 수정되었습니다.',
        data: notice,
      };
    } catch (error) {
      return {
        success: false,
        message: '공지사항 수정에 실패했습니다.',
        error: error.message,
      };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      await this.noticesService.remove(id);
      return {
        success: true,
        message: '공지사항이 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        message: '공지사항 삭제에 실패했습니다.',
        error: error.message,
      };
    }
  }
}

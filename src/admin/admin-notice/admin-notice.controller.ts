import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';

import { AdminNoticeService } from './admin-notice.service'; 

import { AdminNoticeCreateRequestDto } from './dto/request/admin-notice-create-request.dto';
import { AdminNoticeUpdateRequestDto } from './dto/request/admin-notice-update-request.dto';
import { AdminNoticeResponseDto } from './dto/response/admin-notice.response.dto';

@UseGuards(AdminAuthGuard)
@Controller('admin/notice')
export class AdminNoticeController {
  constructor(private readonly noticeService: AdminNoticeService) {}

  @Post()
  create(
    @Body() createNoticeDto: AdminNoticeCreateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    return this.noticeService.create(createNoticeDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: AdminNoticeResponseDto[]; total: number }> {
    return this.noticeService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminNoticeResponseDto> {
    return this.noticeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoticeDto: AdminNoticeUpdateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    return this.noticeService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.noticeService.remove(id);
  }
} 
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
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';

import { AdminNoticeService } from './admin-notice.service'; 

import { AdminNoticeCreateRequestDto } from './dto/request/admin-notice-create-request.dto';
import { AdminNoticeUpdateRequestDto } from './dto/request/admin-notice-update-request.dto';
import { AdminNoticeResponseDto } from './dto/response/admin-notice.response.dto';

@UseGuards(AdminAuthGuard)
@Controller('admin/notice')
export class AdminNoticeController {
  private readonly logger = new Logger(AdminNoticeController.name);

  constructor(private readonly noticeService: AdminNoticeService) {}

  @Post()
  async create(
    @Body() createNoticeDto: AdminNoticeCreateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    this.logger.log(`공지사항 생성 요청: ${createNoticeDto.title}`);
    try {
      const result = await this.noticeService.create(createNoticeDto);
      this.logger.log(`공지사항 생성 성공: ${createNoticeDto.title}`);
      return result;
    } catch (error) {
      this.logger.error(`공지사항 생성 실패: ${createNoticeDto.title}`, error.stack);
      throw new BadRequestException('공지사항 생성 중 오류가 발생했습니다.');
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: AdminNoticeResponseDto[]; total: number }> {
    this.logger.log(`공지사항 목록 조회 요청: page=${page}, limit=${limit}`);
    try {
      const result = await this.noticeService.findAll(page, limit);
      this.logger.log(`공지사항 목록 조회 성공: ${result.data.length}개`);
      return result;
    } catch (error) {
      this.logger.error('공지사항 목록 조회 실패', error.stack);
      throw new InternalServerErrorException('공지사항 목록을 조회하는 중 오류가 발생했습니다.');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminNoticeResponseDto> {
    this.logger.log(`공지사항 상세 조회 요청: ${id}`);
    try {
      const result = await this.noticeService.findOne(id);
      this.logger.log(`공지사항 상세 조회 성공: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`공지사항 상세 조회 실패: ${id}`, error.stack);
      if (error.message.includes('찾을 수 없습니다')) {
        throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
      }
      throw new InternalServerErrorException('공지사항 정보를 조회하는 중 오류가 발생했습니다.');
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: AdminNoticeUpdateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    this.logger.log(`공지사항 수정 요청: ${id}`);
    try {
      const result = await this.noticeService.update(id, updateNoticeDto);
      this.logger.log(`공지사항 수정 성공: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`공지사항 수정 실패: ${id}`, error.stack);
      if (error.message.includes('찾을 수 없습니다')) {
        throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
      }
      throw new BadRequestException('공지사항 수정 중 오류가 발생했습니다.');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`공지사항 삭제 요청: ${id}`);
    try {
      await this.noticeService.remove(id);
      this.logger.log(`공지사항 삭제 성공: ${id}`);
    } catch (error) {
      this.logger.error(`공지사항 삭제 실패: ${id}`, error.stack);
      if (error.message.includes('찾을 수 없습니다')) {
        throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
      }
      throw new InternalServerErrorException('공지사항 삭제 중 오류가 발생했습니다.');
    }
  }
} 
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from '../../schema/notice.schema';
import { AdminNoticeCreateRequestDto } from './dto/request/admin-notice-create-request.dto';
import { AdminNoticeUpdateRequestDto } from './dto/request/admin-notice-update-request.dto';
import { AdminNoticeResponseDto } from './dto/response/admin-notice.response.dto';

@Injectable()
export class AdminNoticeService {
  constructor(
    @InjectModel(Notice.name)
    private noticeModel: Model<NoticeDocument>,
  ) {}

  private toResponseDto(notice: NoticeDocument): AdminNoticeResponseDto {
    return {
      id: notice._id.toString(),
      title: notice.title,
      content: notice.content,
      isPublished: notice.isPublished,
      isModal: notice.isModal,
      modalEndDate: notice.modalEndDate,
      author: notice.author,
      tags: notice.tags,
      createdAt: (notice as any).createdAt,
      updatedAt: (notice as any).updatedAt,
    };
  }

  async create(
    createNoticeDto: AdminNoticeCreateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    try {
      const notice = new this.noticeModel(createNoticeDto);
      const saved = await notice.save();
      return this.toResponseDto(saved);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: AdminNoticeResponseDto[]; total: number }> {
    try {
      const [notices, total] = await Promise.all([
        this.noticeModel
          .find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .exec(),
        this.noticeModel.countDocuments(),
      ]);
      return {
        data: notices.map(this.toResponseDto),
        total,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string): Promise<AdminNoticeResponseDto> {
    const notice = await this.noticeModel.findById(id).exec();
    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return this.toResponseDto(notice);
  }

  async update(
    id: string,
    updateNoticeDto: AdminNoticeUpdateRequestDto,
  ): Promise<AdminNoticeResponseDto> {
    const notice = await this.noticeModel
      .findByIdAndUpdate(id, updateNoticeDto, { new: true })
      .exec();
    if (!notice) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
    return this.toResponseDto(notice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.noticeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    }
  }
} 
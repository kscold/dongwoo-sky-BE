import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const now = new Date();
    const newNotice = new this.noticeModel({
      ...createNoticeDto,
      publishedAt: createNoticeDto.isPublished ? now : null,
    });
    return newNotice.save();
  }

  async findAll(): Promise<Notice[]> {
    return this.noticeModel.find().sort({ createdAt: -1 }).exec();
  }

  async findPublished(): Promise<Notice[]> {
    return this.noticeModel
      .find({ isPublished: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findModal(): Promise<Notice[]> {
    return this.noticeModel
      .find({ isPublished: true, isModal: true })
      .sort({ createdAt: -1 })
      .limit(1) // 가장 최근 모달 공지사항 1개만 반환
      .exec();
  }

  async findOne(id: string): Promise<Notice> {
    const notice = await this.noticeModel.findById(id).exec();
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return notice;
  }

  async update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice> {
    const updates: any = { ...updateNoticeDto };

    // 공개 상태가 변경되었다면 publishedAt 업데이트
    if (updateNoticeDto.isPublished === true) {
      updates.publishedAt = new Date();
    } else if (updateNoticeDto.isPublished === false) {
      updates.publishedAt = null;
    }

    const updatedNotice = await this.noticeModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();

    if (!updatedNotice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    return updatedNotice;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noticeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
  }
}

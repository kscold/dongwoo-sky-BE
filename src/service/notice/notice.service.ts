import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from '../../schema/notice.schema';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const now = new Date();

    // 모달로 설정하는 경우, 기존 모달들을 비활성화
    if (createNoticeDto.isModal) {
      await this.noticeModel
        .updateMany({ isModal: true }, { isModal: false })
        .exec();
    }

    const newNotice = new this.noticeModel({
      ...createNoticeDto,
      publishedAt: createNoticeDto.isPublished ? now : null,
      createdAt: now,
      updatedAt: now,
    });
    return newNotice.save();
  }

  async findAll(page?: number, limit?: number): Promise<Notice[]> {
    const query = this.noticeModel.find().sort({ createdAt: -1 });

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    return query.exec();
  }

  async findPublished(): Promise<Notice[]> {
    return this.noticeModel
      .find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .exec();
  }

  async findModal(): Promise<Notice[]> {
    return this.noticeModel
      .find({ isPublished: true, isModal: true })
      .sort({ createdAt: -1 })
      .limit(1)
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
    const updates: any = {
      ...updateNoticeDto,
      updatedAt: new Date(),
    };

    // 모달로 설정하는 경우, 기존 모달들을 비활성화
    if (updateNoticeDto.isModal) {
      await this.noticeModel
        .updateMany({ _id: { $ne: id }, isModal: true }, { isModal: false })
        .exec();
    }

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

  // 통계 메서드 추가
  async getStats() {
    const total = await this.noticeModel.countDocuments().exec();
    const published = await this.noticeModel
      .countDocuments({ isPublished: true })
      .exec();
    const modal = await this.noticeModel
      .countDocuments({ isModal: true, isPublished: true })
      .exec();

    return {
      totalNotices: total,
      publishedNotices: published,
      modalNotices: modal,
    };
  }
}

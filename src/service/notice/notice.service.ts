import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from '../../schema/notice.schema';
import { NoticeResponseDto } from './dto/notice.response.dto';

@Injectable()
export class NoticeService {
  private readonly logger = new Logger(NoticeService.name);

  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  private toResponseDto(notice: NoticeDocument): NoticeResponseDto {
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

  async getModalNotice(): Promise<NoticeResponseDto | null> {
    try {
      const notice = await this.noticeModel.findOne({
        isModal: true,
        isPublished: true,
      });
      return notice ? this.toResponseDto(notice) : null;
    } catch (error) {
      this.logger.error(
        `모달 공지사항을 가져오는 중 오류가 발생했습니다. ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        '모달 공지사항을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  async getPublishedNotices(): Promise<NoticeResponseDto[]> {
    const notices = await this.noticeModel
      .find({
        isPublished: true,
      })
      .sort({ createdAt: -1 })
      .exec();
    return notices.map(this.toResponseDto);
  }
}

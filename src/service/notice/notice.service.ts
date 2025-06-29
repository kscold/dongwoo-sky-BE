import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notice, NoticeDocument } from '../../schema/notice.schema';

@Injectable()
export class NoticeService {
  private readonly logger = new Logger(NoticeService.name);

  constructor(
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
  ) {}

  async getModalNotice(): Promise<Notice | null> {
    try {
      return this.noticeModel
        .findOne({
          isPublished: true,
          isModal: true,
        })
        .sort({ publishedAt: -1 })
        .exec();
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
}

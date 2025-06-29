import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Home, HomeDocument } from '../../schema/home.schema';
import { Notice, NoticeDocument } from '../../schema/notice.schema';
import {
  WorkShowcase,
  WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';
import {
  CustomerReview,
  CustomerReviewDocument,
} from '../../schema/customer-review.schema';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
    
    @InjectModel(WorkShowcase.name)
    private workShowcaseModel: Model<WorkShowcaseDocument>,
    
    @InjectModel(CustomerReview.name)
    private customerReviewModel: Model<CustomerReviewDocument>,
  ) {}

  async getMainPageData() {
    try {
      const home = await this.homeModel.findOne({ isActive: true }).lean().exec();
      const notices = await this.noticeModel
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec();
      const workShowcases = await this.workShowcaseModel
        .find()
        .sort({ date: -1 })
        .limit(6)
        .lean()
        .exec();
      const customerReviews = await this.customerReviewModel
        .find()
        .sort({ date: -1 })
        .limit(4)
        .lean()
        .exec();

      return {
        home,
        notices,
        workShowcases,
        customerReviews,
      };
    } catch (error) {
      this.logger.error(`[getMainPageData] 메인 페이지 데이터를 가져오는 중 오류가 발생했습니다: ${error.message}`);

      throw new BadRequestException('메인 페이지 데이터 조회 중 오류가 발생했습니다.');
    }
  }
}

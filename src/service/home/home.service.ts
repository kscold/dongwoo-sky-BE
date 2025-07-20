import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
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

import { SiteSettingService } from '../site-setting/site-setting.service';

@Injectable()
export class HomeService {
    private readonly logger = new Logger(HomeService.name);

    constructor(
        private readonly siteSettingService: SiteSettingService,

        @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
        @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
        @InjectModel(WorkShowcase.name)
        private workShowcaseModel: Model<WorkShowcaseDocument>,
        @InjectModel(CustomerReview.name)
        private customerReviewModel: Model<CustomerReviewDocument>,
    ) {}

    async getHomePageData() {
        this.logger.log('[getHomePageData] 홈페이지 데이터 조회 시작');
        try {
            const [home, notices, workShowcases, customerReviews, contactInfo] =
                await Promise.all([
                    this.findOrCreateHome(),
                    this.noticeModel
                        .find({ isPublished: true })
                        .sort({ publishedAt: -1 })
                        .limit(5)
                        .exec(),
                    this.workShowcaseModel
                        .find({ isActive: true })
                        .sort({ publishedAt: -1 })
                        .limit(6)
                        .exec(),
                    this.customerReviewModel
                        .find({ isActive: true })
                        .sort({ publishedAt: -1 })
                        .limit(4)
                        .exec(),

                    this.siteSettingService.getContactInfo(),
                ]);

            this.logger.log('[getHomePageData] 홈페이지 데이터 조회 성공');
            return {
                home,
                notices,
                workShowcases,
                customerReviews,
                contactInfo,
            };
        } catch (e) {
            this.logger.error(
                '[getHomePageData] 홈페이지 데이터 조회 실패',
                e.stack,
            );
            throw new InternalServerErrorException(e.message);
        }
    }

    private async findOrCreateHome(): Promise<HomeDocument> {
        try {
            this.logger.log('[findOrCreateHome] 홈 정보 조회 또는 생성 시작');

            const home = await this.homeModel.findOne({ key: 'main' }).exec();

            if (!home) {
                // 데이터가 아예 없으면 새로 생성
                throw new BadRequestException(
                    '홈 정보가 없습니다. 관리자에게 문의해주세요.',
                );
            }

            this.logger.log('[findOrCreateHome] 홈 정보 조회 또는 생성 성공');

            return home;
        } catch (e) {
            this.logger.error(
                '[findOrCreateHome] 홈 정보 조회 또는 생성 실패',
                e.stack,
            );
            throw new InternalServerErrorException(e.message);
        }
    }
}

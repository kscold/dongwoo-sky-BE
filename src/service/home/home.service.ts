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

import { SiteSetting, SiteSettingDocument } from '../../schema/site-setting.schema';
import { SiteSettingService } from "../site-setting/site-setting.service"

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


    private readonly siteSettingService: SiteSettingService,
  ) { }

  private async findOrCreateHome(): Promise<HomeDocument> {
    let home = await this.homeModel.findOne({ key: "main" }).exec()

    const defaultHomeContent = {
      key: "main",
      title: "홈 설정",
      description: "홈페이지에 대한 설명입니다.",
      heroSection: {
        title: "하늘 위 모든 솔루션,<br/>어울림 스카이와 함께합니다.",
        companyName: "어울림 스카이",
        highlightText: "어울림 스카이",
        subtitle: "안전하고 신뢰할 수 있는 중장비 렌탈 서비스",
        description:
          "최신 스카이 장비로 어떤 높이의 작업이든 신속하고 안전하게! 지금 바로 전문가와 상담하세요.",
        ctaButtons: [
          { text: "🏗️ 무료 견적 받기", link: "/contact" },
          { text: "📋 서비스 안내", link: "/service-guide" },
        ],
        backgroundImageUrls: [],
        isActive: true,
      },
      contentSettings: [
        {
          key: "section-1",
          title: "🏆작업자 자랑거리",
          description:
            "현장에서의 전문성과 성과를 확인해보세요",
          isActive: true,
        },
        {
          key: "section-2",
          title: "💬고객 리뷰",
          description: "실제 고객들의 생생한 이용 후기",
          isActive: true,
        },
      ] as any,
      isActive: true,
    }

    if (!home) {
      // 데이터가 아예 없으면 새로 생성
      home = new this.homeModel(defaultHomeContent)
      await home.save()
    } else if (
      !home.heroSection.ctaButtons ||
      home.heroSection.ctaButtons.length === 0
    ) {
      // 데이터는 있지만, 구버전 구조일 경우 최신 데이터로 덮어쓰기 (마이그레이션)
      home.heroSection = defaultHomeContent.heroSection
      home.contentSettings = defaultHomeContent.contentSettings
      await home.save()
    }

    return home
  }

  async getHomePageData() {
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
      ])

    return {
      home,
      notices,
      workShowcases,
      customerReviews,
      contactInfo,
    }
  }
}

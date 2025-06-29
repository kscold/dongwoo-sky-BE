import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { S3Service } from '../../common/aws/s3.service';

import {
  WorkShowcase,
  WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';
import {
  CustomerReview,
  CustomerReviewDocument,
} from '../../schema/customer-review.schema';
import {
  ContentSettings,
  ContentSettingsDocument,
} from '../../schema/content-settings.schema';
import {
  HeroSettings,
  HeroSettingsDocument,
} from '../../schema/hero-settings.schema';

import {
  CreateWorkShowcaseDto,
  UpdateWorkShowcaseDto,
  CreateCustomerReviewDto,
  UpdateCustomerReviewDto,
} from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(WorkShowcase.name)
    private workShowcaseModel: Model<WorkShowcaseDocument>,
    @InjectModel(CustomerReview.name)
    private customerReviewModel: Model<CustomerReviewDocument>,
    @InjectModel(ContentSettings.name)
    private contentSettingsModel: Model<ContentSettingsDocument>,
    @InjectModel(HeroSettings.name)
    private heroSettingsModel: Model<HeroSettingsDocument>,
    private s3Service: S3Service,
  ) {}

  // 작업자 자랑거리 관련 메서드
  async getTopWorkShowcases(limit: number = 2): Promise<WorkShowcase[]> {
    return this.workShowcaseModel
      .find({ isActive: true })
      .sort({ publishedAt: -1, likeCount: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async getAllWorkShowcases(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: WorkShowcase[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const total = await this.workShowcaseModel.countDocuments({
      isActive: true,
    });

    const items = await this.workShowcaseModel
      .find({ isActive: true })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getWorkShowcaseById(id: string): Promise<WorkShowcase> {
    const showcase = await this.workShowcaseModel.findById(id).lean().exec();

    if (!showcase) {
      throw new NotFoundException('작업 자랑거리를 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.workShowcaseModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    });

    return showcase;
  }

  async createWorkShowcase(dto: CreateWorkShowcaseDto): Promise<WorkShowcase> {
    const showcase = new this.workShowcaseModel(dto);
    return showcase.save();
  }

  async updateWorkShowcase(
    id: string,
    dto: UpdateWorkShowcaseDto,
  ): Promise<WorkShowcase> {
    const showcase = await this.workShowcaseModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();

    if (!showcase) {
      throw new NotFoundException('작업 자랑거리를 찾을 수 없습니다.');
    }

    return showcase;
  }

  async deleteWorkShowcase(id: string): Promise<void> {
    const result = await this.workShowcaseModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('작업 자랑거리를 찾을 수 없습니다.');
    }
  }

  // 고객 리뷰 관련 메서드
  async getTopCustomerReviews(limit: number = 2): Promise<CustomerReview[]> {
    return this.customerReviewModel
      .find({ isActive: true })
      .sort({ publishedAt: -1, rating: -1, helpfulCount: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async getAllCustomerReviews(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: CustomerReview[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const total = await this.customerReviewModel.countDocuments({
      isActive: true,
    });

    const items = await this.customerReviewModel
      .find({ isActive: true })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return {
      items,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCustomerReviewById(id: string): Promise<CustomerReview> {
    const review = await this.customerReviewModel.findById(id).lean().exec();
    if (!review) {
      throw new NotFoundException('고객 리뷰를 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.customerReviewModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    });

    return review;
  }

  async createCustomerReview(
    dto: CreateCustomerReviewDto,
  ): Promise<CustomerReview> {
    const review = new this.customerReviewModel(dto);
    return review.save();
  }

  async updateCustomerReview(
    id: string,
    dto: UpdateCustomerReviewDto,
  ): Promise<CustomerReview> {
    const review = await this.customerReviewModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();

    if (!review) {
      throw new NotFoundException('고객 리뷰를 찾을 수 없습니다.');
    }

    return review;
  }

  async deleteCustomerReview(id: string): Promise<void> {
    const result = await this.customerReviewModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('고객 리뷰를 찾을 수 없습니다.');
    }
  }

  // 다중 이미지 업로드 메서드
  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<{ imageUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (files.length > 10) {
      throw new BadRequestException('최대 10개의 이미지만 업로드 가능합니다.');
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      // 파일 타입 검증
      if (!file.mimetype.startsWith('image/')) {
        throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
      }

      const result = await this.s3Service.uploadFile(file, 'content-images');
      imageUrls.push(result.url);
    }

    return { imageUrls };
  }

  // 좋아요/도움됨 기능
  async incrementWorkShowcaseLike(id: string): Promise<void> {
    await this.workShowcaseModel.findByIdAndUpdate(id, {
      $inc: { likeCount: 1 },
    });
  }

  async incrementCustomerReviewHelpful(id: string): Promise<void> {
    await this.customerReviewModel.findByIdAndUpdate(id, {
      $inc: { helpfulCount: 1 },
    });
  }

  // 컨텐츠 설정 관련 메서드
  async getContentSettings(): Promise<ContentSettings[]> {
    return this.contentSettingsModel.find({ isActive: true }).lean().exec();
  }

  async getContentSettingByKey(key: string): Promise<ContentSettings> {
    const setting = await this.contentSettingsModel
      .findOne({
        key,
        isActive: true,
      })
      .lean()
      .exec();

    if (!setting) {
      throw new NotFoundException(
        `Content setting with key '${key}' not found`,
      );
    }

    return setting;
  }

  async updateContentSetting(
    key: string,
    value: string,
  ): Promise<ContentSettings> {
    const setting = await this.contentSettingsModel
      .findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { new: true, upsert: true },
      )
      .lean()
      .exec();

    return setting;
  }

  async initializeContentSettings(): Promise<void> {
    const defaultSettings = [
      {
        key: 'content_section_title',
        title: '어울림 스카이 소식 제목',
        description: '메인 페이지 컨텐츠 섹션의 제목',
        value: '어울림 스카이 소식',
      },
      {
        key: 'content_section_subtitle',
        title: '어울림 스카이 소식 부제목',
        description: '메인 페이지 컨텐츠 섹션의 부제목',
        value:
          '현장에서 일어나는 생생한 이야기와 고객님들의 소중한 후기를 확인해보세요',
      },
      {
        key: 'work_showcases_title',
        title: '작업자 자랑거리 제목',
        description: '작업자 자랑거리 섹션의 제목',
        value: '작업자 자랑거리',
      },
      {
        key: 'customer_reviews_title',
        title: '고객 리뷰 제목',
        description: '고객 리뷰 섹션의 제목',
        value: '고객 리뷰',
      },
    ];

    for (const setting of defaultSettings) {
      await this.contentSettingsModel.findOneAndUpdate(
        { key: setting.key },
        { ...setting, isActive: true, updatedAt: new Date() },
        { upsert: true },
      );
    }

    // 히어로 섹션 기본 설정도 초기화
    await this.initializeHeroSettings();
  }

  // 히어로 설정 관련 메서드들
  async getHeroSettings(): Promise<HeroSettings> {
    let heroSettings = await this.heroSettingsModel
      .findOne({ key: 'main' })
      .exec();

    if (!heroSettings) {
      // 기본 히어로 설정이 없으면 생성
      await this.initializeHeroSettings();
      heroSettings = await this.heroSettingsModel
        .findOne({ key: 'main' })
        .exec();
    }

    if (!heroSettings) {
      throw new NotFoundException('히어로 설정을 찾을 수 없습니다.');
    }

    return heroSettings;
  }

  async updateHeroSettings(
    updateData: Partial<HeroSettings>,
  ): Promise<HeroSettings> {
    const updatedSettings = await this.heroSettingsModel
      .findOneAndUpdate(
        { key: 'main' },
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true },
      )
      .exec();

    if (!updatedSettings) {
      throw new NotFoundException('히어로 설정 업데이트에 실패했습니다.');
    }

    return updatedSettings;
  }

  // 히어로 이미지 추가
  async addHeroImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string; name: string }> {
    // 현재 히어로 설정 조회
    const heroSettings = await this.getHeroSettings();

    // 최대 10개 제한 확인
    if (
      heroSettings.backgroundImages &&
      heroSettings.backgroundImages.length >= 10
    ) {
      throw new BadRequestException(
        '히어로 이미지는 최대 10개까지 등록할 수 있습니다.',
      );
    }

    // 파일 타입 검증
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    // S3에 업로드
    const result = await this.s3Service.uploadFile(file, 'hero-images');

    // 새 이미지 객체 생성
    const newImage = {
      url: result.url,
      key: result.key,
      name: file.originalname,
      order: heroSettings.backgroundImages
        ? heroSettings.backgroundImages.length
        : 0,
      isActive: true,
    };

    // 히어로 설정에 이미지 추가
    await this.heroSettingsModel.findOneAndUpdate(
      { key: 'main' },
      {
        $push: { backgroundImages: newImage },
        updatedAt: new Date(),
      },
    );

    return {
      url: result.url,
      key: result.key,
      name: file.originalname,
    };
  }

  // 히어로 이미지 삭제
  async deleteHeroImage(imageKey: string): Promise<void> {
    const heroSettings = await this.getHeroSettings();

    if (!heroSettings.backgroundImages) {
      throw new NotFoundException('삭제할 이미지를 찾을 수 없습니다.');
    }

    const imageToDelete = heroSettings.backgroundImages.find(
      (img) => img.key === imageKey,
    );
    if (!imageToDelete) {
      throw new NotFoundException('삭제할 이미지를 찾을 수 없습니다.');
    }

    // S3에서 파일 삭제
    await this.s3Service.deleteFile(imageKey);

    // 히어로 설정에서 이미지 제거
    await this.heroSettingsModel.findOneAndUpdate(
      { key: 'main' },
      {
        $pull: { backgroundImages: { key: imageKey } },
        updatedAt: new Date(),
      },
    );
  }

  // 히어로 이미지 순서 변경
  async updateHeroImagesOrder(
    imageOrders: { key: string; order: number }[],
  ): Promise<void> {
    const heroSettings = await this.getHeroSettings();

    if (!heroSettings.backgroundImages) {
      throw new NotFoundException('히어로 이미지를 찾을 수 없습니다.');
    }

    // 각 이미지의 순서 업데이트
    for (const { key, order } of imageOrders) {
      await this.heroSettingsModel.findOneAndUpdate(
        { key: 'main', 'backgroundImages.key': key },
        {
          $set: { 'backgroundImages.$.order': order },
          updatedAt: new Date(),
        },
      );
    }

    // 순서대로 정렬
    await this.heroSettingsModel.findOneAndUpdate(
      { key: 'main' },
      {
        $push: {
          backgroundImages: {
            $each: [],
            $sort: { order: 1 },
          },
        },
      },
    );
  }

  // 히어로 이미지 활성화/비활성화
  async toggleHeroImageStatus(
    imageKey: string,
    isActive: boolean,
  ): Promise<void> {
    await this.heroSettingsModel.findOneAndUpdate(
      { key: 'main', 'backgroundImages.key': imageKey },
      {
        $set: { 'backgroundImages.$.isActive': isActive },
        updatedAt: new Date(),
      },
    );
  }

  private async initializeHeroSettings(): Promise<void> {
    const defaultHeroSettings = {
      key: 'main',
      title: '어울림 스카이',
      subtitle: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
      description:
        '전문적인 고공작업과 중장비 렌탈 서비스를 제공합니다. 안전하고 효율적인 작업으로 고객님의 프로젝트를 성공으로 이끌어드립니다.',
      ctaText: '무료 견적 문의',
      ctaLink: '/contact',
      backgroundImageUrl: '', // 하위 호환성을 위해 유지
      backgroundImages: [], // 새로운 이미지 배열
      isActive: true,
    };

    await this.heroSettingsModel.findOneAndUpdate(
      { key: 'main' },
      { ...defaultHeroSettings, updatedAt: new Date() },
      { upsert: true },
    );
  }
}

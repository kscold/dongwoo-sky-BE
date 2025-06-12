import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WorkShowcase,
  WorkShowcaseDocument,
} from './schemas/work-showcase.schema';
import {
  CustomerReview,
  CustomerReviewDocument,
} from './schemas/customer-review.schema';
import {
  ContentSettings,
  ContentSettingsDocument,
} from './schemas/content-settings.schema';
import {
  CreateWorkShowcaseDto,
  UpdateWorkShowcaseDto,
  CreateCustomerReviewDto,
  UpdateCustomerReviewDto,
} from './dto/content.dto';
import { S3Service } from '../aws/s3.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(WorkShowcase.name)
    private workShowcaseModel: Model<WorkShowcaseDocument>,
    @InjectModel(CustomerReview.name)
    private customerReviewModel: Model<CustomerReviewDocument>,
    @InjectModel(ContentSettings.name)
    private contentSettingsModel: Model<ContentSettingsDocument>,
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
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LandingPage,
  LandingPageDocument,
} from './schemas/landing-page.schema';
import {
  CreateLandingPageDto,
  UpdateLandingPageDto,
} from './dto/landing-page.dto';
import { S3Service } from '../aws/s3.service';

@Injectable()
export class LandingPageService {
  constructor(
    @InjectModel(LandingPage.name)
    private landingPageModel: Model<LandingPageDocument>,
    private s3Service: S3Service,
  ) {}

  // 메인 페이지 데이터 조회 (Public API)
  async getMainPageData(): Promise<LandingPage> {
    let mainPage = await this.landingPageModel
      .findOne({ isActive: true })
      .lean()
      .exec();

    // 데이터가 없으면 기본값으로 새로 생성
    if (!mainPage) {
      const defaultData = this.getDefaultMainPageData();
      const createdPage = new this.landingPageModel(defaultData);
      mainPage = await createdPage.save();
    }

    return mainPage;
  }

  // 기본 메인 페이지 데이터
  private getDefaultMainPageData(): Partial<LandingPage> {
    return {
      title: '어울림 스카이 - 중장비 렌탈 서비스',
      heroSection: {
        title: '어울림 스카이',
        subtitle: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description:
          '최신 스카이 장비로 어떤 높이의 작업이든 신속하고 안전하게! 지금 바로 전문가와 상담하세요.',
        ctaText: '무료 견적 받기',
        ctaLink: '/contact',
        isActive: true,
      },
      isActive: true,
    };
  }

  // 어드민 - 모든 랜딩 페이지 조회
  async findAll(): Promise<LandingPage[]> {
    return this.landingPageModel
      .find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  // 어드민 - 특정 랜딩 페이지 조회
  async findOne(id: string): Promise<LandingPage> {
    const landingPage = await this.landingPageModel.findById(id).lean().exec();
    if (!landingPage) {
      throw new NotFoundException(`랜딩 페이지를 찾을 수 없습니다. ID: ${id}`);
    }
    return landingPage;
  }

  // 어드민 - pageId로 랜딩 페이지 조회
  async findByPageId(pageId: string): Promise<LandingPage | null> {
    return this.landingPageModel.findOne({ pageId }).lean().exec();
  }

  // 어드민 - 랜딩 페이지 생성
  async create(
    createLandingPageDto: CreateLandingPageDto,
  ): Promise<LandingPage> {
    // pageId 중복 확인
    const existingPage = await this.landingPageModel.findOne({
      pageId: createLandingPageDto.pageId,
    });

    if (existingPage) {
      throw new ConflictException(
        `이미 존재하는 페이지 ID입니다: ${createLandingPageDto.pageId}`,
      );
    }

    const createdPage = new this.landingPageModel(createLandingPageDto);
    return createdPage.save();
  }

  // 어드민 - 랜딩 페이지 업데이트
  async update(
    id: string,
    updateLandingPageDto: UpdateLandingPageDto,
  ): Promise<LandingPage> {
    const updatedPage = await this.landingPageModel
      .findByIdAndUpdate(id, updateLandingPageDto, { new: true })
      .lean()
      .exec();

    if (!updatedPage) {
      throw new NotFoundException(`랜딩 페이지를 찾을 수 없습니다. ID: ${id}`);
    }

    return updatedPage;
  }

  // 어드민 - 랜딩 페이지 삭제
  async remove(id: string): Promise<void> {
    const result = await this.landingPageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`랜딩 페이지를 찾을 수 없습니다. ID: ${id}`);
    }
  }

  // 어드민 - 활성화/비활성화 토글
  async toggleActive(id: string): Promise<LandingPage> {
    const landingPage = await this.landingPageModel.findById(id);
    if (!landingPage) {
      throw new NotFoundException(`랜딩 페이지를 찾을 수 없습니다. ID: ${id}`);
    }

    landingPage.isActive = !landingPage.isActive;
    return landingPage.save();
  }

  // 메인 페이지 데이터 초기화 (개발용)
  async initializeMainPage(): Promise<LandingPage> {
    const existingMainPage = await this.landingPageModel.findOne({
      pageId: 'main',
    });

    if (existingMainPage) {
      return existingMainPage;
    }

    const defaultData = this.getDefaultMainPageData();
    const mainPage = new this.landingPageModel(defaultData);
    return mainPage.save();
  }

  // 히어로 섹션 이미지 업로드
  async uploadHeroImage(file: Express.Multer.File): Promise<{
    imageUrl: string;
    originalUrl?: string;
    optimizedUrl?: string;
  }> {
    if (!file) {
      throw new NotFoundException('업로드할 파일이 없습니다.');
    }

    // 지원되는 이미지 형식 확인
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        '지원하지 않는 이미지 형식입니다. JPG, PNG, WebP, GIF 형식을 사용해주세요.',
      );
    }

    // 파일 크기 확인 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        '파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.',
      );
    }

    try {
      // S3에 이미지 업로드 (CloudFront CDN을 통해 캐싱됨)
      const uploadResult = await this.s3Service.uploadFile(
        file,
        'landing-page/hero-images',
        {
          originalName: file.originalname,
          mimeType: file.mimetype,
        },
      );

      // CloudFront URL에 캐시 최적화 파라미터 추가
      const optimizedUrl = `${uploadResult.url}?version=${Date.now()}&format=auto&quality=85`;

      return {
        imageUrl: uploadResult.url,
        originalUrl: uploadResult.url,
        optimizedUrl: optimizedUrl,
      };
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw new BadRequestException(
        '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
      );
    }
  }
}

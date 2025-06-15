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
import { FileService } from '../common/service/file.service';

@Injectable()
export class LandingPageService {
  constructor(
    @InjectModel(LandingPage.name)
    private landingPageModel: Model<LandingPageDocument>,
    private s3Service: S3Service,
    private fileService: FileService,
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
        backgroundImageUrls: [],
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

    const landingPage = new this.landingPageModel(createLandingPageDto);
    return landingPage.save();
  }

  // 어드민 - 랜딩 페이지 수정
  async update(
    id: string,
    updateLandingPageDto: UpdateLandingPageDto,
  ): Promise<LandingPage> {
    const existingPage = await this.landingPageModel.findById(id);
    if (!existingPage) {
      throw new NotFoundException(`랜딩 페이지를 찾을 수 없습니다. ID: ${id}`);
    }

    // pageId 변경 시 중복 확인
    if (
      (updateLandingPageDto as any).pageId &&
      (updateLandingPageDto as any).pageId !== (existingPage as any).pageId
    ) {
      const duplicatePage = await this.landingPageModel.findOne({
        pageId: (updateLandingPageDto as any).pageId,
        _id: { $ne: id },
      });

      if (duplicatePage) {
        throw new ConflictException(
          `이미 존재하는 페이지 ID입니다: ${(updateLandingPageDto as any).pageId}`,
        );
      }
    }

    const updatedPage = await this.landingPageModel
      .findByIdAndUpdate(id, updateLandingPageDto, { new: true })
      .lean()
      .exec();

    if (!updatedPage) {
      throw new NotFoundException('랜딩 페이지 업데이트에 실패했습니다.');
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

  // 메인 페이지가 없으면 생성
  async ensureMainPageExists(): Promise<LandingPage> {
    const existingMainPage = await this.landingPageModel
      .findOne({ isActive: true })
      .exec();

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
  }> {
    console.log(
      `히어로 이미지 업로드 요청: ${file.originalname}, 대상 폴더: landing-page`,
    );

    // 현재 날짜로 서브폴더 구성 (YYYY-MM 형식)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadPath = `landing-page/hero-images/${yearMonth}`;

    // FileService를 사용하여 업로드 (공지사항과 동일한 방식)
    const uploadResult = await this.fileService.uploadFile(file, uploadPath, {
      compressImage: true,
      imageOptions: {
        quality: 85,
        width: 1920, // 최대 너비 제한
      },
      allowedExtensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'heic',
        'heif',
        'avif',
      ],
      maxSize: 15 * 1024 * 1024, // 15MB로 공지사항과 동일하게 설정
    });

    console.log(`히어로 이미지 업로드 완료: ${uploadResult.key}`);

    // 업로드된 이미지를 메인 페이지의 backgroundImageUrls에 추가
    try {
      const mainPage = await this.getMainPageData();
      const existingUrls = mainPage.heroSection?.backgroundImageUrls || [];

      // 이미 존재하지 않는 경우에만 추가
      if (!existingUrls.includes(uploadResult.url)) {
        const updatedUrls = [...existingUrls, uploadResult.url];

        await this.landingPageModel
          .findByIdAndUpdate((mainPage as any)._id, {
            'heroSection.backgroundImageUrls': updatedUrls,
          })
          .exec();

        console.log(
          'Background image URL added to database:',
          uploadResult.url,
        );
      }
    } catch (dbError) {
      console.error(
        'Failed to update database, but file was uploaded:',
        dbError,
      );
      // 파일은 성공적으로 업로드되었으므로 URL은 반환
    }

    return {
      imageUrl: uploadResult.url,
    };
  }

  // 히어로 섹션 다중 이미지 업로드
  async uploadHeroImages(files: Express.Multer.File[]): Promise<{
    imageUrls: string[];
  }> {
    console.log(
      `다중 히어로 이미지 업로드 요청: ${files.length}개 파일, 대상 폴더: landing-page`,
    );

    // 현재 날짜로 서브폴더 구성 (YYYY-MM 형식)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadPath = `landing-page/hero-images/${yearMonth}`;

    const imageUrls: string[] = [];

    for (const file of files) {
      const uploadResult = await this.fileService.uploadFile(file, uploadPath, {
        compressImage: true,
        imageOptions: {
          quality: 85,
          width: 1920, // 최대 너비 제한
        },
        allowedExtensions: [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'webp',
          'heic',
          'heif',
          'avif',
        ],
        maxSize: 15 * 1024 * 1024, // 15MB로 공지사항과 동일하게 설정
      });
      console.log(`히어로 이미지 업로드 완료: ${uploadResult.key}`);

      imageUrls.push(uploadResult.url);
    }

    // 업로드된 이미지들을 메인 페이지의 backgroundImageUrls에 추가
    try {
      const mainPage = await this.getMainPageData();
      const existingUrls = mainPage.heroSection?.backgroundImageUrls || [];

      // 중복되지 않은 URL만 추가
      const newUrls = imageUrls.filter((url) => !existingUrls.includes(url));
      if (newUrls.length > 0) {
        const updatedUrls = [...existingUrls, ...newUrls];

        await this.landingPageModel
          .findByIdAndUpdate((mainPage as any)._id, {
            'heroSection.backgroundImageUrls': updatedUrls,
          })
          .exec();

        console.log('Background image URLs added to database:', newUrls);
      }
    } catch (dbError) {
      console.error(
        'Failed to update database, but files were uploaded:',
        dbError,
      );
      // 파일들은 성공적으로 업로드되었으므로 URL들은 반환
    }

    return {
      imageUrls,
    };
  }

  // 업로드된 히어로 이미지들 조회
  async getHeroImages(): Promise<{ images: string[] }> {
    try {
      console.log('=== GetHeroImages method called ===');

      const mainPage = await this.getMainPageData();
      console.log('MainPage data:', JSON.stringify(mainPage, null, 2));

      // 안전하게 배경 이미지 URL 배열 가져오기
      let images: string[] = [];

      if (mainPage && mainPage.heroSection) {
        if (Array.isArray(mainPage.heroSection.backgroundImageUrls)) {
          images = mainPage.heroSection.backgroundImageUrls;
        } else {
          // backgroundImageUrls 필드가 없는 경우 빈 배열로 초기화
          console.log(
            'backgroundImageUrls 필드가 없습니다. 빈 배열로 초기화합니다.',
          );
          images = [];

          // 데이터베이스에 필드 추가
          const existingId = (mainPage as any)._id;
          if (existingId) {
            await this.landingPageModel
              .findByIdAndUpdate(existingId, {
                'heroSection.backgroundImageUrls': [],
              })
              .exec();
            console.log(
              'backgroundImageUrls 필드가 데이터베이스에 추가되었습니다.',
            );
          }
        }
      }

      console.log('Hero images retrieved:', images);
      return { images };
    } catch (error) {
      console.error('히어로 이미지 조회 오류:', error);
      console.error('Error stack:', error.stack);
      return { images: [] }; // 에러 발생 시 빈 배열 반환
    }
  }

  // 선택된 이미지를 메인 배경으로 설정
  async setHeroImage(imageUrl: string): Promise<LandingPage> {
    try {
      const mainPage = await this.getMainPageData();

      // 선택된 이미지가 업로드된 이미지 목록에 있는지 확인
      const backgroundImageUrls =
        mainPage.heroSection?.backgroundImageUrls || [];
      if (!backgroundImageUrls.includes(imageUrl)) {
        // 이미지가 목록에 없으면 추가
        backgroundImageUrls.push(imageUrl);
      }

      const updateData = {
        heroSection: {
          ...mainPage.heroSection,
          backgroundImageUrl: imageUrl,
          backgroundImageUrls,
        },
      };

      const existingId = (mainPage as any)._id;
      if (!existingId) {
        throw new NotFoundException(
          '업데이트할 랜딩 페이지를 찾을 수 없습니다.',
        );
      }

      const updatedPage = await this.landingPageModel
        .findByIdAndUpdate(existingId, updateData, { new: true })
        .lean()
        .exec();

      if (!updatedPage) {
        throw new NotFoundException('랜딩 페이지 업데이트에 실패했습니다.');
      }

      console.log('Hero image set successfully:', imageUrl);
      return updatedPage;
    } catch (error) {
      console.error('히어로 이미지 설정 오류:', error);
      throw new BadRequestException('이미지 설정에 실패했습니다.');
    }
  }

  // 히어로 이미지 삭제
  async deleteHeroImage(imageUrl: string): Promise<{ message: string }> {
    try {
      const mainPage = await this.getMainPageData();

      const backgroundImageUrls =
        mainPage.heroSection?.backgroundImageUrls || [];
      const updatedUrls = backgroundImageUrls.filter((url) => url !== imageUrl);

      // 삭제된 이미지가 현재 메인 배경인 경우, 다른 이미지로 변경
      let newBackgroundUrl = mainPage.heroSection?.backgroundImageUrl;
      if (newBackgroundUrl === imageUrl) {
        newBackgroundUrl =
          updatedUrls[0] ||
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      }

      const updateData = {
        heroSection: {
          ...mainPage.heroSection,
          backgroundImageUrl: newBackgroundUrl,
          backgroundImageUrls: updatedUrls,
        },
      };

      const existingId = (mainPage as any)._id;
      if (!existingId) {
        throw new NotFoundException(
          '업데이트할 랜딩 페이지를 찾을 수 없습니다.',
        );
      }

      await this.landingPageModel
        .findByIdAndUpdate(existingId, updateData, { new: true })
        .exec();

      // S3에서 파일 삭제 (옵션)
      try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        // CloudFront URL에서 S3 key 추출
        if (
          imageUrl.includes('cloudfront.net') ||
          imageUrl.includes('amazonaws.com')
        ) {
          // URL에서 landing-page 이후 경로 추출
          const matches = imageUrl.match(/landing-page\/hero-images\/[^?]+/);
          if (matches) {
            const key = matches[0];
            await this.fileService.deleteFile(key);
            console.log('S3 파일 삭제 성공:', key);
          }
        }
      } catch (s3Error) {
        console.warn('S3 파일 삭제 실패 (무시됨):', s3Error);
      }

      console.log('Hero image deleted successfully:', imageUrl);
      return { message: '이미지가 성공적으로 삭제되었습니다.' };
    } catch (error) {
      console.error('히어로 이미지 삭제 오류:', error);
      throw new BadRequestException('이미지 삭제에 실패했습니다.');
    }
  }
}

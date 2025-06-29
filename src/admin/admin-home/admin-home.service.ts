import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Home, HomeDocument } from '../../schema/home.schema';
import { FileService } from '../../common/file/file.service';
import { ApiResponseDto } from '../../common/dto/response/api-response.dto';
import { AdminHomeResponseDto } from './dto/response/admin-home.response.dto';

@Injectable()
export class AdminHomeService {
  constructor(
    @InjectModel(Home.name)
    private homeModel: Model<HomeDocument>,
    private fileService: FileService,
  ) {}

  // 메인 홈 데이터 조회 (Public API)
  async getMainHomeData(): Promise<ApiResponseDto<Home>> {
    try {
      let mainHome = await this.homeModel
        .findOne({ isActive: true })
        .lean()
        .exec();

      if (!mainHome) {
        const defaultData = this.getDefaultMainHomeData();
        const created = new this.homeModel(defaultData);
        mainHome = await created.save();
      }

      return new ApiResponseDto({ success: true, code: 200, data: mainHome });
    } catch (error) {
      throw error;
    }
  }

  // 기본 메인 홈 데이터
  private getDefaultMainHomeData(): Partial<Home> {
    return {
      key: 'main',
      title: '홈 설정',
      description: '홈페이지에 대한 설명입니다.',
      heroSection: {
        title: '어울림 스카이',
        subtitle: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
        description:
          '최신 스카이 장비로 어떤 높이의 작업이든 신속하고 안전하게! 지금 바로 전문가와 상담하세요.',
        ctaText: '무료 견적 문의',
        ctaLink: '/contact',
        backgroundImageUrl: '',
        backgroundImages: [],
        isActive: true,
      },
      contentSettings: [],
      isActive: true,
    };
  }

  private mapHomeToResponseDto(home: Home): AdminHomeResponseDto {
    return {
      pageId: home.key,
      heroTitle: {
        preTitle: home.heroSection?.title || '',
        mainTitle: home.heroSection?.subtitle || '',
        postTitle: home.heroSection?.description || '',
      },
      heroSubtitle: home.heroSection?.ctaText || '',
      heroImages: (home.heroSection?.backgroundImages || []).map(
        (img) => img.url,
      ),
      heroButtons: {
        primaryButtonText: home.heroSection?.ctaText || '',
        primaryButtonLink: home.heroSection?.ctaLink || '',
        secondaryButtonText: '', // 필요시 확장
        secondaryButtonLink: '', // 필요시 확장
      },
      isActive: home.isActive,
      sortOrder: (home as any).sortOrder ?? 0,
    };
  }

  // 어드민 - 전체 홈 조회
  async findAll(): Promise<ApiResponseDto<AdminHomeResponseDto[]>> {
    try {
      const homes = await this.homeModel
        .find()
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      const data = homes.map((h) => this.mapHomeToResponseDto(h));
      return new ApiResponseDto({ success: true, code: 200, data });
    } catch (error) {
      throw error;
    }
  }

  // 어드민 - 특정 홈 조회
  async findOne(id: string): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      const home = await this.homeModel.findById(id).lean().exec();
      if (!home)
        throw new NotFoundException(`홈을 찾을 수 없습니다. ID: ${id}`);
      return new ApiResponseDto({
        success: true,
        code: 200,
        data: this.mapHomeToResponseDto(home),
      });
    } catch (error) {
      throw error;
    }
  }

  // 어드민 - 홈 생성
  async create(
    createHomeDto: any,
  ): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      // key 중복 확인
      const existing = await this.homeModel.findOne({ key: createHomeDto.key });
      if (existing)
        throw new ConflictException(
          `이미 존재하는 key입니다: ${createHomeDto.key}`,
        );
      const home = new this.homeModel(createHomeDto);
      const saved = await home.save();
      return new ApiResponseDto({
        success: true,
        code: 201,
        data: this.mapHomeToResponseDto(saved),
      });
    } catch (error) {
      throw error;
    }
  }

  // 어드민 - 홈 수정
  async update(
    id: string,
    updateHomeDto: any,
  ): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      const updated = await this.homeModel
        .findByIdAndUpdate(id, updateHomeDto, { new: true })
        .lean()
        .exec();
      if (!updated)
        throw new NotFoundException(`홈을 찾을 수 없습니다. ID: ${id}`);
      return new ApiResponseDto({
        success: true,
        code: 200,
        data: this.mapHomeToResponseDto(updated),
      });
    } catch (error) {
      throw error;
    }
  }

  // 어드민 - 홈 삭제
  async remove(id: string): Promise<ApiResponseDto<null>> {
    try {
      const result = await this.homeModel.findByIdAndDelete(id).exec();
      if (!result)
        throw new NotFoundException(`홈을 찾을 수 없습니다. ID: ${id}`);
      return new ApiResponseDto({ success: true, code: 200 });
    } catch (error) {
      throw error;
    }
  }

  // 메인 홈이 없으면 생성
  async ensureMainHomeExists(): Promise<ApiResponseDto<Home>> {
    try {
      let mainHome = await this.homeModel.findOne({ isActive: true }).exec();
      if (mainHome)
        return new ApiResponseDto({ success: true, code: 200, data: mainHome });
      const defaultData = this.getDefaultMainHomeData();
      const created = new this.homeModel(defaultData);
      mainHome = await created.save();
      return new ApiResponseDto({ success: true, code: 201, data: mainHome });
    } catch (error) {
      throw error;
    }
  }

  // 히어로 이미지 업로드 (단일)
  async uploadHeroImage(
    file: Express.Multer.File,
  ): Promise<ApiResponseDto<{ image: any }>> {
    try {
      // 공통 파일 업로드 로직 사용 (FileService)
      const heroImage = await this.fileService.uploadImageAsHeroImage(
        file,
        'landing-page/hero-images',
      );

      // 업로드된 이미지를 메인 페이지의 backgroundImages에 추가
      const mainPage = await this.homeModel.findOne({ isActive: true }).exec();
      if (mainPage) {
        const images = Array.isArray(mainPage.heroSection.backgroundImages)
          ? mainPage.heroSection.backgroundImages
          : [];
        images.push(heroImage);
        await this.homeModel.findByIdAndUpdate(mainPage._id, {
          'heroSection.backgroundImages': images,
        });
      }

      return new ApiResponseDto({
        success: true,
        code: 201,
        data: { image: heroImage },
      });
    } catch (error) {
      return new ApiResponseDto({
        success: false,
        code: 400,
        error: error.message,
      });
    }
  }

  // 히어로 이미지 업로드 (다중)
  async uploadHeroImages(
    files: Express.Multer.File[],
  ): Promise<ApiResponseDto<{ images: any[] }>> {
    try {
      // 공통 파일 업로드 로직 사용 (FileService)
      const heroImages = await this.fileService.uploadImagesAsHeroImages(
        files,
        'landing-page/hero-images',
      );

      // 업로드된 이미지들을 메인 페이지의 backgroundImages에 추가
      const mainPage = await this.homeModel.findOne({ isActive: true }).exec();
      if (mainPage) {
        const images = Array.isArray(mainPage.heroSection.backgroundImages)
          ? mainPage.heroSection.backgroundImages
          : [];
        heroImages.forEach((img) => images.push(img));
        await this.homeModel.findByIdAndUpdate(mainPage._id, {
          'heroSection.backgroundImages': images,
        });
      }

      return new ApiResponseDto({
        success: true,
        code: 201,
        data: { images: heroImages },
      });
    } catch (error) {
      return new ApiResponseDto({
        success: false,
        code: 400,
        error: error.message,
      });
    }
  }

  // 업로드된 히어로 이미지들 조회
  async getHeroImages(): Promise<{ images: string[] }> {
    // mainPage는 ApiResponseDto<Home> 타입이므로 .data로 접근해야 함
    const mainPageRes = await this.getMainHomeData();
    const mainPage = mainPageRes.data;
    let images: string[] = [];
    if (
      mainPage &&
      mainPage.heroSection &&
      Array.isArray(mainPage.heroSection.backgroundImages)
    ) {
      images = mainPage.heroSection.backgroundImages.map((img) => img.url);
    }
    return { images };
  }

  // 선택된 이미지를 메인 배경으로 설정
  async setHeroImage(imageUrl: string): Promise<ApiResponseDto<Home>> {
    try {
      const mainPageRes = await this.getMainHomeData();
      const mainPage = mainPageRes.data;
      if (!mainPage)
        throw new NotFoundException('메인 홈 데이터를 찾을 수 없습니다.');
      const heroImages = mainPage.heroSection.backgroundImages || [];
      // 해당 url을 가진 HeroImage가 있는지 확인
      const found = heroImages.find((img) => img.url === imageUrl);
      if (!found)
        throw new NotFoundException('해당 이미지를 찾을 수 없습니다.');
      // backgroundImageUrl만 변경
      const updateData = {
        heroSection: {
          ...mainPage.heroSection,
          backgroundImageUrl: imageUrl,
        },
      };
      const updatedPage = await this.homeModel
        .findByIdAndUpdate((mainPage as any)._id, updateData, { new: true })
        .lean()
        .exec();
      if (!updatedPage)
        throw new NotFoundException('랜딩 페이지 업데이트에 실패했습니다.');
      return new ApiResponseDto({
        success: true,
        code: 200,
        data: updatedPage,
      });
    } catch (error) {
      throw error;
    }
  }

  // 히어로 이미지 삭제
  async deleteHeroImage(
    imageUrl: string,
  ): Promise<ApiResponseDto<{ message: string }>> {
    try {
      const mainPageRes = await this.getMainHomeData();
      const mainPage = mainPageRes.data;
      if (!mainPage)
        throw new NotFoundException('메인 홈 데이터를 찾을 수 없습니다.');
      const heroImages = mainPage.heroSection.backgroundImages || [];
      // 삭제 대상 HeroImage 찾기
      const updatedImages = heroImages.filter((img) => img.url !== imageUrl);
      // 삭제된 이미지가 현재 메인 배경인 경우, 다른 이미지로 변경
      let newBackgroundUrl = mainPage.heroSection.backgroundImageUrl;
      if (newBackgroundUrl === imageUrl) {
        newBackgroundUrl =
          updatedImages[0]?.url ||
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      }
      const updateData = {
        heroSection: {
          ...mainPage.heroSection,
          backgroundImageUrl: newBackgroundUrl,
          backgroundImages: updatedImages,
        },
      };
      await this.homeModel
        .findByIdAndUpdate((mainPage as any)._id, updateData, { new: true })
        .exec();
      // S3에서 파일 삭제 (옵션)
      try {
        if (
          imageUrl.includes('cloudfront.net') ||
          imageUrl.includes('amazonaws.com')
        ) {
          const matches = imageUrl.match(/landing-page\/hero-images\/[^?]+/);
          if (matches) {
            const key = matches[0];
            await this.fileService.deleteFile(key);
          }
        }
      } catch (s3Error) {
        // 무시
      }
      return new ApiResponseDto({
        success: true,
        code: 200,
        data: { message: '이미지가 성공적으로 삭제되었습니다.' },
      });
    } catch (error) {
      throw error;
    }
  }
}

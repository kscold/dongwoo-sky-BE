import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService } from '../../common/file/file.service';

import { Home, HomeDocument } from '../../schema/home.schema';

import { ApiResponseDto } from '../../common/dto/response/api-response.dto';
import { AdminHomeResponseDto } from './dto/response/admin-home.response.dto';

@Injectable()
export class AdminHomeService {
  private readonly logger = new Logger(AdminHomeService.name);

  constructor(
    @InjectModel(Home.name)
    private homeModel: Model<HomeDocument>,
    private fileService: FileService,
  ) { }

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

      return new ApiResponseDto({ success: true, code: HttpStatus.OK, data: mainHome });
    } catch (error) {
      this.logger.error(`[getMainHomeData] 메인 홈 데이터 조회 실패: ${error.message}`);
      throw new BadRequestException(`[getMainHomeData] 메인 홈 데이터 조회 실패: ${error.message}`);
    }
  }

  // 기본 메인 홈 데이터
  private async getDefaultMainHomeData(): Promise<Partial<Home>> {
    // 데이터베이스에서 현재 세팅 값을 실제로 받아옴
    const home = await this.homeModel.findOne({ isActive: true }).lean().exec();

    return home;
  }

  private mapHomeToResponseDto(home: HomeDocument): AdminHomeResponseDto {
    const ctaButtons = home.heroSection?.ctaButtons || [];
    return {
      _id: home._id?.toString(),
      pageId: home.key,
      heroTitle: {
        preTitle: home.heroSection?.title || '',
        mainTitle: home.heroSection?.subtitle || '',
        postTitle: home.heroSection?.description || '',
      },
      heroSubtitle: '', // 이 필드는 더 이상 사용되지 않음
      heroImages: (home.heroSection?.backgroundImageUrls || []).map(
        img => img.url,
      ),
      heroButtons: {
        primaryButtonText: ctaButtons[0]?.text || '',
        primaryButtonLink: ctaButtons[0]?.link || '',
        secondaryButtonText: ctaButtons[1]?.text || '',
        secondaryButtonLink: ctaButtons[1]?.link || '',
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
      return new ApiResponseDto({ success: true, code: HttpStatus.OK, data });
    } catch (error) {
      this.logger.error(`[findAll] 홈 조회 실패: ${error.message}`);
      throw new BadRequestException(`[findAll] 홈 조회 실패: ${error.message}`);
    }
  }

  // 어드민 - 특정 홈 조회
  async findOne(id: string): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      const home = await this.homeModel.findById(id).lean().exec();
      if (!home)
        throw new BadRequestException(`홈을 찾을 수 없습니다. ID: ${id}`);
      return new ApiResponseDto({
        success: true,
        code: HttpStatus.OK,
        data: this.mapHomeToResponseDto(home),
      });
    } catch (error) {
      this.logger.error(`[findOne] 홈 조회 실패: ${error.message}`);
      throw new BadRequestException(`[findOne] 홈 조회 실패: ${error.message}`);
    }
  }

  // 어드민 - 홈 생성
  async create(
    createHomeDto: any,
  ): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      this.logger.log('[create] 생성 요청 데이터:', createHomeDto);

      // 프론트엔드 데이터를 백엔드 스키마에 맞게 변환
      const transformedData = {
        key: createHomeDto.pageId || 'main',
        title: createHomeDto.heroTitle?.mainTitle || '홈 설정',
        description: createHomeDto.heroSubtitle || '홈페이지에 대한 설명입니다.',
        heroSection: {
          title: createHomeDto.heroTitle?.preTitle || '',
          companyName: createHomeDto.heroSection?.companyName || '어울림 스카이',
          highlightText: createHomeDto.heroSection?.highlightText || '어울림 스카이',
          subtitle: createHomeDto.heroTitle?.mainTitle || '',
          description: createHomeDto.heroTitle?.postTitle || '',
          ctaButtons: [
            {
              text: createHomeDto.heroButtons?.primaryButtonText || '',
              link: createHomeDto.heroButtons?.primaryButtonLink || '',
            },
            {
              text: createHomeDto.heroButtons?.secondaryButtonText || '',
              link: createHomeDto.heroButtons?.secondaryButtonLink || '',
            },
          ],
          backgroundImageUrls: (createHomeDto.heroImages || []).map(url =>
            typeof url === 'string' ? { url, alt: '' } : url
          ),
          isActive: true,
        },
        isActive: createHomeDto.isActive !== false,
      };

      this.logger.log('[create] 변환된 데이터:', transformedData);

      // key 중복 확인
      const existing = await this.homeModel.findOne({ key: transformedData.key });
      if (existing)
        throw new ConflictException(
          `이미 존재하는 key입니다: ${transformedData.key}`,
        );

      const home = new this.homeModel(transformedData);
      const saved = await home.save();

      this.logger.log('[create] 저장된 데이터:', saved);

      return new ApiResponseDto({
        success: true,
        code: HttpStatus.OK,
        data: this.mapHomeToResponseDto(saved),
      });
    } catch (error) {
      this.logger.error(`[create] 생성 실패: ${error.message}`);
      throw new BadRequestException(`[create] 생성 실패: ${error.message}`);
    }
  }

  // 어드민 - 홈 수정
  async update(
    id: string,
    updateHomeDto: any,
  ): Promise<ApiResponseDto<AdminHomeResponseDto>> {
    try {
      this.logger.log('[update] 업데이트 요청 데이터:', updateHomeDto);

      // 프론트엔드 데이터를 백엔드 스키마에 맞게 변환
      const transformedData = {
        key: updateHomeDto.pageId || 'main',
        title: updateHomeDto.heroTitle?.mainTitle || '홈 설정',
        description: updateHomeDto.heroSubtitle || '홈페이지에 대한 설명입니다.',
        heroSection: {
          title: updateHomeDto.heroTitle?.preTitle || '',
          companyName: updateHomeDto.heroSection?.companyName || '어울림 스카이',
          highlightText: updateHomeDto.heroSection?.highlightText || '어울림 스카이',
          subtitle: updateHomeDto.heroTitle?.mainTitle || '',
          description: updateHomeDto.heroTitle?.postTitle || '',
          ctaButtons: [
            {
              text: updateHomeDto.heroButtons?.primaryButtonText || '',
              link: updateHomeDto.heroButtons?.primaryButtonLink || '',
            },
            {
              text: updateHomeDto.heroButtons?.secondaryButtonText || '',
              link: updateHomeDto.heroButtons?.secondaryButtonLink || '',
            },
          ],
          backgroundImageUrls: (updateHomeDto.heroImages || []).map(url =>
            typeof url === 'string' ? { url, alt: '' } : url
          ),
          isActive: true,
        },
        isActive: updateHomeDto.isActive !== false,
      };

      this.logger.log('[update] 변환된 업데이트 데이터:', transformedData);

      const updated = await this.homeModel
        .findByIdAndUpdate(id, transformedData, { new: true })
        .exec();
      if (!updated)
        throw new BadRequestException(`홈을 찾을 수 없습니다. ID: ${id}`);

      this.logger.log('[update] 업데이트된 데이터:', updated);

      return new ApiResponseDto({
        success: true,
        code: HttpStatus.OK,
        data: this.mapHomeToResponseDto(updated),
      });
    } catch (error) {
      this.logger.error('[update] 업데이트 실패:', error);
      throw error;
    }
  }

  // 어드민 - 홈 삭제
  async remove(id: string): Promise<ApiResponseDto<null>> {
    try {
      const result = await this.homeModel.findByIdAndDelete(id).exec();
      if (!result)
        throw new BadRequestException(`홈을 찾을 수 없습니다. ID: ${id}`);
      return new ApiResponseDto({ success: true, code: HttpStatus.OK });
    } catch (error) {
      this.logger.error(`[remove] 홈 삭제 실패: ${error.message}`);
      throw new BadRequestException(`[remove] 홈 삭제 실패: ${error.message}`);
    }
  }

  // 메인 홈이 없으면 생성
  async ensureMainHomeExists(): Promise<ApiResponseDto<Home>> {
    try {
      let mainHome = await this.homeModel.findOne({ isActive: true }).exec();

      if (mainHome)
        return new ApiResponseDto({ success: true, code: HttpStatus.OK, data: mainHome });

      const defaultData = this.getDefaultMainHomeData();
      const created = new this.homeModel(defaultData);
      mainHome = await created.save();
      return new ApiResponseDto({ success: true, code: HttpStatus.OK, data: mainHome });
    } catch (error) {
      this.logger.error(`[ensureMainHomeExists] 홈을 찾을 수 없습니다. ID: ${error.message}`);
      throw new BadRequestException(`[ensureMainHomeExists] 홈을 찾을 수 없습니다. ID: ${error.message}`);
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
        'home/hero-images',
      );

      // 단순히 업로드된 이미지 정보만 반환 (DB 저장은 별도 저장 API에서 처리)
      return new ApiResponseDto({
        success: true,
        code: HttpStatus.OK,
        data: { image: heroImage },
      });
    } catch (error) {
      this.logger.error(`[uploadHeroImage] 히어로 이미지 업로드 실패: ${error.message}`);
      throw new BadRequestException(`[uploadHeroImage] 히어로 이미지 업로드 실패: ${error.message}`);
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
        'home/hero-images',
      );

      // 단순히 업로드된 이미지 정보만 반환 (DB 저장은 별도 저장 API에서 처리)
      return new ApiResponseDto({
        success: true,
        code: HttpStatus.OK,
        data: { images: heroImages },
      });
    } catch (error) {
      this.logger.error(`[uploadHeroImages] 히어로 이미지 업로드 실패: ${error.message}`);
      throw new BadRequestException(`[uploadHeroImages] 히어로 이미지 업로드 실패: ${error.message}`);
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
      Array.isArray(mainPage.heroSection.backgroundImageUrls)
    ) {
      images = mainPage.heroSection.backgroundImageUrls.map((img) => img.url);
    }
    return { images };
  }

  // 히어로 이미지 삭제
  async deleteHeroImage(
    imageUrl: string,
  ): Promise<ApiResponseDto<{ message: string }>> {
    try {
      const mainPageRes = await this.getMainHomeData();
      const mainPage = mainPageRes.data;
      if (!mainPage)
        throw new BadRequestException('메인 홈 데이터를 찾을 수 없습니다.');
      const heroImages = mainPage.heroSection.backgroundImageUrls || [];
      // 삭제 대상 HeroImage 찾기
      const updatedImages = heroImages.filter((img) => img.url !== imageUrl);

      const updateData = {
        'heroSection.backgroundImageUrls': updatedImages,
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
          const matches = imageUrl.match(/home\/hero-images\/[^?]+/);
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
        code: HttpStatus.OK,
        data: { message: '이미지가 성공적으로 삭제되었습니다.' },
      });
    } catch (error) {
      this.logger.error(`[deleteHeroImage] 히어로 이미지 삭제 실패: ${error.message}`);
      throw new BadRequestException(`[deleteHeroImage] 히어로 이미지 삭제 실패: ${error.message}`);
    }
  }
}

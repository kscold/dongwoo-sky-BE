import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService } from '../../common/file/file.service';

import { Home, HomeDocument, HeroImage } from '../../schema/home.schema';

import { AdminHomeCreateDto } from '../admin-home/dto/request/admin-home-create.dto';
import { AdminHomeUpdateDto } from '../admin-home/dto/request/admin-home-update.dto';

@Injectable()
export class AdminHomeService {
  private readonly logger = new Logger(AdminHomeService.name);

  constructor(
    @InjectModel(Home.name) private homeModel: Model<HomeDocument>,
    private fileService: FileService,
  ) {}

  // 메인 페이지 데이터 조회 (Public API)
  async getMainPageData(): Promise<Home> {
    const mainPage = await this.homeModel.findOne({ isActive: true }).lean().exec();
    if (!mainPage) {
      const doc = await this.ensureMainPageExists();
      return doc.toObject();
    }
    return mainPage;
  }

  // 기본 메인 페이지 데이터
  private getDefaultMainPageData(): Partial<Home> {
    return {
      key: 'main',
      title: '어울림 스카이 - 중장비 렌탈 서비스',
      description: '기본 홈페이지 설명',
      heroSection: {
        title: '어울림 스카이',
        subtitle: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
        description:
          '최신 스카이 장비로 어떤 높이의 작업이든 신속하고 안전하게! 지금 바로 전문가와 상담하세요.',
        ctaText: '무료 견적 받기',
        ctaLink: '/contact',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        backgroundImages: [],
        isActive: true,
      },
      isActive: true,
    };
  }

  // 어드민 - 모든 홈 페이지 조회
  async findAll(): Promise<Home[]> {
    return this.homeModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  // 어드민 - 특정 홈 페이지 조회
  async findOne(id: string): Promise<Home> {
    const home = await this.homeModel.findById(id).lean().exec();
    if (!home) {
      throw new BadRequestException(`홈 페이지를 찾을 수 없습니다. ID: ${id}`);
    }
    return home;
  }

  // 어드민 - 홈 페이지 생성
  async create(createHomeDto: AdminHomeCreateDto): Promise<Home> {
    const existingPage = await this.homeModel.findOne({
      key: createHomeDto.key,
    });
    if (existingPage) {
      throw new ConflictException(
        `이미 존재하는 키입니다: ${createHomeDto.key}`,
      );
    }
    const home = new this.homeModel(createHomeDto);
    return home.save();
  }

  // 어드민 - 홈 페이지 수정
  async update(id: string, updateHomeDto: AdminHomeUpdateDto): Promise<Home> {
    const existingPage = await this.homeModel.findById(id).exec();

    if (!existingPage) {
      throw new BadRequestException(`홈 페이지를 찾을 수 없습니다. ID: ${id}`);
    }

    if (updateHomeDto.key && updateHomeDto.key !== existingPage.key) {
      const duplicatePage = await this.homeModel.findOne({
        key: updateHomeDto.key,
        _id: { $ne: id },
      });
      if (duplicatePage) {
        throw new ConflictException(
          `이미 존재하는 키입니다: ${updateHomeDto.key}`,
        );
      }
    }

    if (updateHomeDto.isActive) {
      await this.homeModel.updateMany(
        { _id: { $ne: id } },
        { $set: { isActive: false } },
      );
    }

    Object.assign(existingPage, updateHomeDto);
    return existingPage.save();
  }

  // 어드민 - 홈 페이지 삭제
  async remove(id: string): Promise<void> {
    const result = await this.homeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException(`홈 페이지를 찾을 수 없습니다. ID: ${id}`);
    }
  }

  // 메인 페이지가 없으면 생성
  async ensureMainPageExists(): Promise<HomeDocument> {
    let mainPage = await this.homeModel.findOne({ key: 'main' }).exec();
    if (!mainPage) {
      this.logger.log('Main page not found, creating a default one.');
      const defaultData = this.getDefaultMainPageData();
      const createdPage = new this.homeModel(defaultData);
      mainPage = await createdPage.save();
    }
    return mainPage;
  }

  // 단일 히어로 이미지 업로드
  async uploadHeroImage(
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    const { imageUrls } = await this.uploadHeroImages([file]);
    if (imageUrls.length === 0) {
      throw new BadRequestException('Image upload failed.');
    }
    return { imageUrl: imageUrls[0] };
  }

  // 히어로 섹션 다중 이미지 업로드
  async uploadHeroImages(
    files: Express.Multer.File[],
  ): Promise<{ imageUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('File is required.');
    }

    const mainPage = await this.ensureMainPageExists();
    const uploadedImages: HeroImage[] = [];

    for (const file of files) {
      const uploadedFile = await this.fileService.uploadFile(
        file,
        'home/hero-images',
      );
      const newImage: HeroImage = {
        url: uploadedFile.url,
        key: uploadedFile.key,
        name: uploadedFile.originalName,
        order: (mainPage.heroSection.backgroundImages.length || 0) + 1,
        isActive: true,
      };
      uploadedImages.push(newImage);
    }

    mainPage.heroSection.backgroundImages.push(...uploadedImages);

    await mainPage.save();

    return { imageUrls: uploadedImages.map((img) => img.url) };
  }

  // 업로드된 히어로 이미지들 조회
  async getHeroImages(): Promise<{ images: HeroImage[] }> {
    const mainPage = await this.ensureMainPageExists();
    return { images: mainPage.heroSection.backgroundImages || [] };
  }

  // 선택된 이미지를 메인 배경으로 설정
  async setHeroImage(imageUrl: string): Promise<Home> {
    const mainPage = await this.ensureMainPageExists();
    const imageExists = mainPage.heroSection.backgroundImages.some(
      (img) => img.url === imageUrl,
    );

    if (!imageExists) {
      throw new BadRequestException(
        '선택한 이미지가 업로드된 목록에 없습니다.',
      );
    }

    mainPage.heroSection.backgroundImageUrl = imageUrl;
    return mainPage.save();
  }

  // 히어로 이미지 삭제
  async deleteHeroImage(imageUrl: string): Promise<{ message: string }> {
    const mainPage = await this.ensureMainPageExists();
    const images = mainPage.heroSection.backgroundImages;
    const imageToDelete = images.find((img) => img.url === imageUrl);

    if (!imageToDelete) {
      throw new BadRequestException('삭제할 이미지를 찾을 수 없습니다.');
    }

    // S3에서 파일 삭제
    await this.fileService.deleteFile(imageToDelete.key);

    // DB에서 이미지 정보 삭제
    mainPage.heroSection.backgroundImages = images.filter(
      (img) => img.url !== imageUrl,
    );

    // 삭제된 이미지가 메인 배경인 경우, 다른 이미지로 변경
    if (mainPage.heroSection.backgroundImageUrl === imageUrl) {
      mainPage.heroSection.backgroundImageUrl =
        mainPage.heroSection.backgroundImages[0]?.url ||
        this.getDefaultMainPageData().heroSection.backgroundImageUrl;
    }

    await mainPage.save();

    return { message: '이미지가 성공적으로 삭제되었습니다.' };
  }
}

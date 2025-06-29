import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LandingPageService } from './landing-page.service';
import {
  CreateLandingPageDto,
  UpdateLandingPageDto,
} from './dto/landing-page.dto';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { UserRole } from '../../schema/user.schema';
import { LandingPage } from '../../schema/landing-page.schema';

@Controller('landing-pages')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // Public API - 현재 활성화된 랜딩 페이지 데이터 조회
  @Get('current')
  async getCurrentLandingPage(): Promise<LandingPage> {
    return this.landingPageService.getMainPageData();
  }

  // 어드민 API - 업로드된 히어로 이미지들 조회
  @Get('hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getHeroImages(): Promise<{ images: string[] }> {
    console.log('=== Get Hero Images Request ===');
    return this.landingPageService.getHeroImages();
  }

  // 어드민 API - 모든 랜딩 페이지 조회
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<LandingPage[]> {
    return this.landingPageService.findAll();
  }

  // 어드민 API - 특정 랜딩 페이지 조회
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<LandingPage> {
    return this.landingPageService.findOne(id);
  }

  // 어드민 API - 랜딩 페이지 생성
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLandingPageDto: CreateLandingPageDto,
  ): Promise<LandingPage> {
    return this.landingPageService.create(createLandingPageDto);
  }

  // 어드민 API - 랜딩 페이지 업데이트
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateLandingPageDto: UpdateLandingPageDto,
  ): Promise<LandingPage> {
    return this.landingPageService.update(id, updateLandingPageDto);
  }

  // 어드민 API - 랜딩 페이지 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.landingPageService.remove(id);
  }

  // 어드민 API - 메인 페이지 초기화 (개발용)
  @Post('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async ensureMainPageExists(): Promise<LandingPage> {
    return this.landingPageService.ensureMainPageExists();
  }

  // 어드민 API - 히어로 섹션 이미지 업로드
  @Post('upload-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
      fileFilter: (req, file, cb) => {
        console.log(
          `받은 파일: ${file.originalname}, MIME: ${file.mimetype}, 크기: ${file.size}`,
        );

        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/heic',
          'image/heif',
          'image/avif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log(`차단된 이미지 파일 타입: ${file.mimetype}`);
          cb(
            new Error(`지원하지 않는 이미지 형식입니다: ${file.mimetype}`),
            false,
          );
        }
      },
    }),
  )
  async uploadHeroImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    console.log(
      `히어로 이미지 업로드 요청: ${file?.originalname}, 크기: ${file?.size}바이트`,
    );

    if (!file) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('파일 데이터가 비어있습니다.');
    }

    console.log(`파일 버퍼 크기: ${file.buffer.length}바이트`);

    return this.landingPageService.uploadHeroImage(file);
  }

  // 어드민 API - 히어로 섹션 다중 이미지 업로드 (최대 10개)
  @Post('upload-hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
        files: 10,
      },
      fileFilter: (req, file, cb) => {
        console.log(
          `받은 다중 파일: ${file.originalname}, MIME: ${file.mimetype}, 크기: ${file.size}`,
        );

        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/heic',
          'image/heif',
          'image/avif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log(`차단된 다중 이미지 파일 타입: ${file.mimetype}`);
          cb(
            new Error(`지원하지 않는 이미지 형식입니다: ${file.mimetype}`),
            false,
          );
        }
      },
    }),
  )
  async uploadHeroImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ imageUrls: string[] }> {
    console.log(`다중 히어로 이미지 업로드 요청: ${files?.length}개 파일`);

    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (files.length > 10) {
      throw new BadRequestException('최대 10개의 파일만 업로드할 수 있습니다.');
    }

    // 각 파일의 버퍼 검증
    files.forEach((file, index) => {
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException(
          `파일 ${index + 1}의 데이터가 비어있습니다.`,
        );
      }
      console.log(`파일 ${index + 1} 버퍼 크기: ${file.buffer.length}바이트`);
    });

    return this.landingPageService.uploadHeroImages(files);
  }

  // 어드민 API - 히어로 이미지 URL 업데이트 (선택된 이미지를 메인 배경으로 설정)
  @Patch('set-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setHeroImage(@Body() body: { imageUrl: string }): Promise<LandingPage> {
    console.log('=== Set Hero Image Request ===', body);
    return this.landingPageService.setHeroImage(body.imageUrl);
  }

  // 어드민 API - 히어로 이미지 삭제
  @Delete('hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteHeroImage(
    @Body() body: { imageUrl: string },
  ): Promise<{ message: string }> {
    console.log('=== Delete Hero Image Request ===', body);
    return this.landingPageService.deleteHeroImage(body.imageUrl);
  }
}

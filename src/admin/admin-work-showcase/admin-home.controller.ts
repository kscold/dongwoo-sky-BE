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

import { JwtAuthGuard } from '../admin-user/guard/jwt-auth.guard';
import { RolesGuard } from '../admin-user/guard/roles.guard';
import { Roles } from '../admin-user/decorator/roles.decorator';

import { AdminHomeService } from './admin-home.service';
import { UserRole } from '../../schema/user.schema';
import { Home } from '../../schema/home.schema';

@Controller('admin-home')
export class AdminHomeController {
  constructor(private readonly adminHomeService: AdminHomeService) {}

  // Public API - 현재 활성화된 홈 데이터 조회
  @Get('current')
  async getCurrentHome(): Promise<Home> {
    return this.adminHomeService.getMainHomeData();
  }

  // 어드민 API - 홈 전체 조회
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<Home[]> {
    return this.adminHomeService.findAll();
  }

  // 어드민 API - 특정 홈 조회
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<Home> {
    return this.adminHomeService.findOne(id);
  }

  // 어드민 API - 홈 생성
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHomeDto: any): Promise<Home> {
    return this.adminHomeService.create(createHomeDto);
  }

  // 어드민 API - 홈 업데이트
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateHomeDto: any,
  ): Promise<Home> {
    return this.adminHomeService.update(id, updateHomeDto);
  }

  // 어드민 API - 홈 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminHomeService.remove(id);
  }

  // 어드민 API - 홈 초기화 (개발용)
  @Post('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async ensureMainHomeExists(): Promise<Home> {
    return this.adminHomeService.ensureMainHomeExists();
  }

  // 어드민 API - 히어로 이미지 업로드 (단일)
  @Post('upload-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
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
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }
    return this.adminHomeService.uploadHeroImage(file);
  }

  // 어드민 API - 히어로 섹션 다중 이미지 업로드 (최대 10개)
  @Post('upload-hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024, files: 10 },
      fileFilter: (req, file, cb) => {
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
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }
    if (files.length > 10) {
      throw new BadRequestException('최대 10개의 파일만 업로드할 수 있습니다.');
    }
    files.forEach((file, index) => {
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException(
          `파일 ${index + 1}의 데이터가 비어있습니다.`,
        );
      }
    });
    return this.adminHomeService.uploadHeroImages(files);
  }

  // 어드민 API - 히어로 이미지 URL 업데이트 (선택된 이미지를 메인 배경으로 설정)
  @Patch('set-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setHeroImage(@Body() body: { imageUrl: string }): Promise<Home> {
    return this.adminHomeService.setHeroImage(body.imageUrl);
  }

  // 어드민 API - 히어로 이미지 삭제
  @Delete('hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteHeroImage(
    @Body() body: { imageUrl: string },
  ): Promise<{ message: string }> {
    return this.adminHomeService.deleteHeroImage(body.imageUrl);
  }
}

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


import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';

import { AdminHomeCreateDto } from '../admin-home/dto/request/admin-home-create.dto';
import { AdminHomeUpdateDto } from '../admin-home/dto/request/admin-home-update.dto';
import { multerOptions } from '../../common/config/multer.config';
import { AdminHomeService } from './admin-home.service';

import { UserRole } from '../../schema/user.schema';
import { Home, HeroImage } from '../../schema/home.schema';

@Controller('admin-home')
export class AdminHomeController {
  constructor(private readonly adminHomeService: AdminHomeService) {}

  // Public API - 현재 활성화된 홈 데이터 조회
  @Get('current')
  async getCurrentHome(): Promise<Home> {
    return this.adminHomeService.getMainPageData();
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
  async create(@Body() createHomeDto: AdminHomeCreateDto): Promise<Home> {
    return this.adminHomeService.create(createHomeDto);
  }

  // 어드민 API - 홈 업데이트
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateHomeDto: AdminHomeUpdateDto,
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
    return this.adminHomeService.ensureMainPageExists();
  }

  // 어드민 API - 히어로 이미지 업로드 (단일)
  @Post('upload-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadHeroImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    if (!file) throw new BadRequestException('File is required.');
    return this.adminHomeService.uploadHeroImage(file);
  }

  // 어드민 API - 히어로 섹션 다중 이미지 업로드 (최대 10개)
  @Post('upload-hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadHeroImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ imageUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required.');
    }
    return this.adminHomeService.uploadHeroImages(files);
  }

  // 어드민 API - 업로드된 히어로 이미지 목록 조회
  @Get('hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getHeroImages(): Promise<{ images: HeroImage[] }> {
    return this.adminHomeService.getHeroImages();
  }

  // 어드민 API - 히어로 이미지 URL 업데이트 (선택된 이미지를 메인 배경으로 설정)
  @Patch('set-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setHeroImage(@Body() body: { imageUrl: string }): Promise<Home> {
    return this.adminHomeService.setHeroImage(body.imageUrl);
  }

  // 어드민 API - 히어로 이미지 삭제
  @Delete('delete-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteHeroImage(
    @Body() body: { imageUrl: string },
  ): Promise<{ message: string }> {
    return this.adminHomeService.deleteHeroImage(body.imageUrl);
  }
}

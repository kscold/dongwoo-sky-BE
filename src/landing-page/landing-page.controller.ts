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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LandingPageService } from './landing-page.service';
import {
  CreateLandingPageDto,
  UpdateLandingPageDto,
} from './dto/landing-page.dto';
import { AdminAuthGuard } from '../admin/guards/admin-auth.guard';
import { LandingPage } from './schemas/landing-page.schema';

@Controller('landing-pages')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // Public API - 현재 활성화된 랜딩 페이지 데이터 조회
  @Get('current')
  async getCurrentLandingPage(): Promise<LandingPage> {
    return this.landingPageService.getMainPageData();
  }

  // 어드민 API - 모든 랜딩 페이지 조회
  @Get()
  @UseGuards(AdminAuthGuard)
  async findAll(): Promise<LandingPage[]> {
    return this.landingPageService.findAll();
  }

  // 어드민 API - 특정 랜딩 페이지 조회
  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async findOne(@Param('id') id: string): Promise<LandingPage> {
    return this.landingPageService.findOne(id);
  }

  // 어드민 API - 랜딩 페이지 생성
  @Post()
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLandingPageDto: CreateLandingPageDto,
  ): Promise<LandingPage> {
    return this.landingPageService.create(createLandingPageDto);
  }

  // 어드민 API - 랜딩 페이지 업데이트
  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateLandingPageDto: UpdateLandingPageDto,
  ): Promise<LandingPage> {
    return this.landingPageService.update(id, updateLandingPageDto);
  }

  // 어드민 API - 랜딩 페이지 삭제
  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.landingPageService.remove(id);
  }

  // 어드민 API - 랜딩 페이지 활성화/비활성화
  @Patch(':id/toggle-active')
  @UseGuards(AdminAuthGuard)
  async toggleActive(@Param('id') id: string): Promise<LandingPage> {
    return this.landingPageService.toggleActive(id);
  }

  // 어드민 API - 메인 페이지 초기화 (개발용)
  @Post('initialize')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async initializeMainPage(): Promise<LandingPage> {
    return this.landingPageService.initializeMainPage();
  }

  // 어드민 API - 히어로 섹션 이미지 업로드
  @Post('upload-hero-image')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadHeroImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    return this.landingPageService.uploadHeroImage(file);
  }
}

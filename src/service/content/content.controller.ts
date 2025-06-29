import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AdminAuthGuard } from '../../common/auth/guards/admin-auth.guard';

import { ContentService } from './content.service';

import {
  CreateWorkShowcaseDto,
  UpdateWorkShowcaseDto,
  CreateCustomerReviewDto,
  UpdateCustomerReviewDto,
} from './dto/content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // 메인 페이지용 - 최신 작업 자랑거리 5개
  @Get('work-showcases/top')
  async getTopWorkShowcases() {
    const items = await this.contentService.getTopWorkShowcases(5);
    return {
      success: true,
      data: items,
    };
  }

  // 작업 자랑거리 전체 목록 (페이지네이션)
  @Get('work-showcases')
  async getAllWorkShowcases(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    const result = await this.contentService.getAllWorkShowcases(page, limit);
    return {
      success: true,
      data: result,
    };
  }

  // 작업 자랑거리 상세 조회
  @Get('work-showcases/:id')
  async getWorkShowcaseById(@Param('id') id: string) {
    const item = await this.contentService.getWorkShowcaseById(id);
    return {
      success: true,
      data: item,
    };
  }

  // 작업 자랑거리 생성 (관리자만)
  @Post('work-showcases')
  @UseGuards(AdminAuthGuard)
  async createWorkShowcase(@Body() dto: CreateWorkShowcaseDto) {
    const item = await this.contentService.createWorkShowcase(dto);
    return {
      success: true,
      data: item,
      message: '작업 자랑거리가 성공적으로 생성되었습니다.',
    };
  }

  // 작업 자랑거리 수정 (관리자만)
  @Put('work-showcases/:id')
  @UseGuards(AdminAuthGuard)
  async updateWorkShowcase(
    @Param('id') id: string,
    @Body() dto: UpdateWorkShowcaseDto,
  ) {
    const item = await this.contentService.updateWorkShowcase(id, dto);
    return {
      success: true,
      data: item,
      message: '작업 자랑거리가 성공적으로 수정되었습니다.',
    };
  }

  // 작업 자랑거리 삭제 (관리자만)
  @Delete('work-showcases/:id')
  @UseGuards(AdminAuthGuard)
  async deleteWorkShowcase(@Param('id') id: string) {
    await this.contentService.deleteWorkShowcase(id);
    return {
      success: true,
      message: '작업 자랑거리가 성공적으로 삭제되었습니다.',
    };
  }

  // 작업 자랑거리 좋아요
  @Post('work-showcases/:id/like')
  async likeWorkShowcase(@Param('id') id: string) {
    await this.contentService.incrementWorkShowcaseLike(id);
    return {
      success: true,
      message: '좋아요가 반영되었습니다.',
    };
  }

  // 메인 페이지용 - 최신 고객 리뷰 2개
  @Get('customer-reviews/top')
  async getTopCustomerReviews() {
    const items = await this.contentService.getTopCustomerReviews(5);
    return {
      success: true,
      data: items,
    };
  }

  // 고객 리뷰 전체 목록 (페이지네이션)
  @Get('customer-reviews')
  async getAllCustomerReviews(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    const result = await this.contentService.getAllCustomerReviews(page, limit);
    return {
      success: true,
      data: result,
    };
  }

  // 고객 리뷰 상세 조회
  @Get('customer-reviews/:id')
  async getCustomerReviewById(@Param('id') id: string) {
    const item = await this.contentService.getCustomerReviewById(id);
    return {
      success: true,
      data: item,
    };
  }

  // 고객 리뷰 생성 (관리자만)
  @Post('customer-reviews')
  @UseGuards(AdminAuthGuard)
  async createCustomerReview(@Body() dto: CreateCustomerReviewDto) {
    const item = await this.contentService.createCustomerReview(dto);
    return {
      success: true,
      data: item,
      message: '고객 리뷰가 성공적으로 생성되었습니다.',
    };
  }

  // 고객 리뷰 수정 (관리자만)
  @Put('customer-reviews/:id')
  @UseGuards(AdminAuthGuard)
  async updateCustomerReview(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerReviewDto,
  ) {
    const item = await this.contentService.updateCustomerReview(id, dto);
    return {
      success: true,
      data: item,
      message: '고객 리뷰가 성공적으로 수정되었습니다.',
    };
  }

  // 고객 리뷰 삭제 (관리자만)
  @Delete('customer-reviews/:id')
  @UseGuards(AdminAuthGuard)
  async deleteCustomerReview(@Param('id') id: string) {
    await this.contentService.deleteCustomerReview(id);
    return {
      success: true,
      message: '고객 리뷰가 성공적으로 삭제되었습니다.',
    };
  }

  // 고객 리뷰 도움됨
  @Post('customer-reviews/:id/helpful')
  async markCustomerReviewHelpful(@Param('id') id: string) {
    await this.contentService.incrementCustomerReviewHelpful(id);
    return {
      success: true,
      message: '도움됨이 반영되었습니다.',
    };
  }

  // 다중 이미지 업로드 (최대 10개)
  @Post('upload-images')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const result = await this.contentService.uploadMultipleImages(files);
    return {
      success: true,
      data: result,
      message: '이미지가 성공적으로 업로드되었습니다.',
    };
  }

  // 컨텐츠 설정 관련 엔드포인트
  @Get('settings')
  async getContentSettings() {
    const settings = await this.contentService.getContentSettings();
    return {
      success: true,
      data: settings,
    };
  }

  @Get('settings/:key')
  async getContentSettingByKey(@Param('key') key: string) {
    const setting = await this.contentService.getContentSettingByKey(key);
    return {
      success: true,
      data: setting,
    };
  }

  @Put('settings/:key')
  @UseGuards(AdminAuthGuard)
  async updateContentSetting(
    @Param('key') key: string,
    @Body('value') value: string,
  ) {
    const setting = await this.contentService.updateContentSetting(key, value);
    return {
      success: true,
      data: setting,
      message: '설정이 성공적으로 업데이트되었습니다.',
    };
  }

  @Post('settings/initialize')
  @UseGuards(AdminAuthGuard)
  async initializeContentSettings() {
    await this.contentService.initializeContentSettings();
    return {
      success: true,
      message: '컨텐츠 설정이 초기화되었습니다.',
    };
  }

  // 히어로 설정 관련 엔드포인트
  @Get('hero-settings')
  async getHeroSettings() {
    const settings = await this.contentService.getHeroSettings();
    return {
      success: true,
      data: settings,
      message: '히어로 설정을 성공적으로 조회했습니다.',
    };
  }

  @Put('hero-settings')
  @UseGuards(AdminAuthGuard)
  async updateHeroSettings(@Body() updateData: any) {
    const settings = await this.contentService.updateHeroSettings(updateData);
    return {
      success: true,
      data: settings,
      message: '히어로 설정이 성공적으로 업데이트되었습니다.',
    };
  }

  // 히어로 이미지 관리 엔드포인트
  @Post('hero-images/upload')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('file', 1))
  async uploadHeroImage(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    const result = await this.contentService.addHeroImage(files[0]);
    return {
      success: true,
      data: result,
      message: '히어로 이미지가 성공적으로 업로드되었습니다.',
    };
  }

  @Delete('hero-images/:key')
  @UseGuards(AdminAuthGuard)
  async deleteHeroImage(@Param('key') key: string) {
    await this.contentService.deleteHeroImage(key);
    return {
      success: true,
      message: '히어로 이미지가 성공적으로 삭제되었습니다.',
    };
  }

  @Put('hero-images/order')
  @UseGuards(AdminAuthGuard)
  async updateHeroImagesOrder(
    @Body() orderData: { key: string; order: number }[],
  ) {
    await this.contentService.updateHeroImagesOrder(orderData);
    return {
      success: true,
      message: '히어로 이미지 순서가 성공적으로 업데이트되었습니다.',
    };
  }

  @Put('hero-images/:key/toggle')
  @UseGuards(AdminAuthGuard)
  async toggleHeroImageStatus(
    @Param('key') key: string,
    @Body('isActive') isActive: boolean,
  ) {
    await this.contentService.toggleHeroImageStatus(key, isActive);
    return {
      success: true,
      message: '히어로 이미지 상태가 성공적으로 변경되었습니다.',
    };
  }
}

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
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';

import { fileUploadOptions } from '../../common/config/file-upload.config';

import { AdminHomeService } from './admin-home.service';

import { UserRole } from '../../schema/user.schema';
import { AdminHomeCreateDto } from './dto/request/admin-home-create.dto';
import { AdminHomeUpdateDto } from './dto/request/admin-home-update.dto';
import { AdminHomeResponseDto } from './dto/response/admin-home.response.dto';

@Controller('admin/home')
export class AdminHomeController {
  constructor(private readonly adminHomeService: AdminHomeService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<AdminHomeResponseDto[]> {
    const result = await this.adminHomeService.findAll();
    return result.data;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<AdminHomeResponseDto> {
    const result = await this.adminHomeService.findOne(id);
    return result.data;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createHomeDto: AdminHomeCreateDto,
  ): Promise<AdminHomeResponseDto> {
    const result = await this.adminHomeService.create(createHomeDto);
    return result.data;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateHomeDto: AdminHomeUpdateDto,
  ): Promise<AdminHomeResponseDto> {
    const result = await this.adminHomeService.update(id, updateHomeDto);
    return result.data;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.adminHomeService.remove(id);
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async ensureMainHomeExists() {
    return this.adminHomeService.ensureMainHomeExists();
  }

  @Post('upload-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadHeroImage(@UploadedFiles() files: Express.Multer.File[]) {
    // 단일 파일만 허용
    const file = Array.isArray(files) ? files[0] : files;
    return this.adminHomeService.uploadHeroImage(file);
  }

  @Post('upload-hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions))
  async uploadHeroImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.adminHomeService.uploadHeroImages(files);
  }

  @Patch('set-hero-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setHeroImage(@Body() body: { imageUrl: string }) {
    return this.adminHomeService.setHeroImage(body.imageUrl);
  }

  @Delete('hero-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteHeroImage(@Body() body: { imageUrl: string }) {
    return this.adminHomeService.deleteHeroImage(body.imageUrl);
  }
}

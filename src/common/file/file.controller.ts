import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { fileUploadOptions } from '../config/file-upload.config';
import { FileService } from './file.service';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 단일 파일 업로드
   * @param file 업로드할 파일
   * @param folder 저장할 폴더 경로 (선택사항)
   * @returns 업로드된 파일 정보
   */
  @Post('single')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'uploads',
  ) {
    if (!file) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const result = await this.fileService.uploadFile(file, folder, {
      compressImage: true,
      imageOptions: {
        quality: 85,
        width: 1920,
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
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
      ],
      maxSize: 15 * 1024 * 1024, // 15MB
    });

    return {
      success: true,
      data: {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimeType,
      },
    };
  }

  /**
   * 다중 파일 업로드
   * @param files 업로드할 파일들
   * @param folder 저장할 폴더 경로 (선택사항)
   * @returns 업로드된 파일들의 정보
   */
  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'uploads',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const results = [];
    for (const file of files) {
      const result = await this.fileService.uploadFile(file, folder, {
        compressImage: true,
        imageOptions: {
          quality: 85,
          width: 1920,
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
          'pdf',
          'doc',
          'docx',
          'xls',
          'xlsx',
        ],
        maxSize: 15 * 1024 * 1024, // 15MB
      });

      results.push({
        url: result.url,
        key: result.key,
        originalName: result.originalName,
        mimeType: result.mimeType,
      });
    }

    return {
      success: true,
      data: {
        files: results,
        urls: results.map(r => r.url),
      },
    };
  }

  /**
   * 이미지 전용 업로드 (WebP 압축 강제)
   * @param files 업로드할 이미지 파일들
   * @param folder 저장할 폴더 경로 (선택사항)
   * @returns 업로드된 이미지들의 정보
   */
  @Post('images')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'images',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('이미지 파일이 제공되지 않았습니다.');
    }

    const results = await this.fileService.uploadImagesAsHeroImages(files, folder);

    return {
      success: true,
      data: {
        images: results,
        urls: results.map(r => r.url),
      },
    };
  }

  /**
   * 단일 이미지 업로드 (WebP 압축 강제)
   * @param file 업로드할 이미지 파일
   * @param folder 저장할 폴더 경로 (선택사항)
   * @returns 업로드된 이미지 정보
   */
  @Post('image')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'images',
  ) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 제공되지 않았습니다.');
    }

    const result = await this.fileService.uploadImageAsHeroImage(file, folder);

    return {
      success: true,
      data: {
        url: result.url,
        key: result.key,
        name: result.name,
        isActive: result.isActive,
      },
    };
  }
}
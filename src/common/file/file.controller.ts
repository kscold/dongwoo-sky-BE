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
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { fileUploadOptions } from '../config/file-upload.config';
import { FileService } from './file.service';

@Controller('upload')
export class FileController {
  private readonly logger = new Logger(FileController.name);

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
    this.logger.log(`단일 파일 업로드 요청: ${file?.originalname}, folder: ${folder}`);
    try {
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

      this.logger.log(`단일 파일 업로드 성공: ${file.originalname}`);
      return {
        success: true,
        data: {
          url: result.url,
          key: result.key,
          originalName: result.originalName,
          mimeType: result.mimeType,
        },
      };
    } catch (error) {
      this.logger.error(`단일 파일 업로드 실패: ${file?.originalname}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('파일 업로드 중 오류가 발생했습니다.');
    }
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
    this.logger.log(`다중 파일 업로드 요청: ${files?.length}개, folder: ${folder}`);
    try {
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

      this.logger.log(`다중 파일 업로드 성공: ${files.length}개`);
      return {
        success: true,
        data: {
          files: results,
          urls: results.map(r => r.url),
        },
      };
    } catch (error) {
      this.logger.error(`다중 파일 업로드 실패: ${files?.length}개`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('다중 파일 업로드 중 오류가 발생했습니다.');
    }
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
    this.logger.log(`이미지 업로드 요청: ${files?.length}개, folder: ${folder}`);
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('이미지 파일이 제공되지 않았습니다.');
      }

      const results = await this.fileService.uploadImagesAsHeroImages(files, folder);

      this.logger.log(`이미지 업로드 성공: ${files.length}개`);
      return {
        success: true,
        data: {
          images: results,
          urls: results.map(r => r.url),
        },
      };
    } catch (error) {
      this.logger.error(`이미지 업로드 실패: ${files?.length}개`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('이미지 업로드 중 오류가 발생했습니다.');
    }
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
    this.logger.log(`단일 이미지 업로드 요청: ${file?.originalname}, folder: ${folder}`);
    try {
      if (!file) {
        throw new BadRequestException('이미지 파일이 제공되지 않았습니다.');
      }

      const result = await this.fileService.uploadImageAsHeroImage(file, folder);

      this.logger.log(`단일 이미지 업로드 성공: ${file.originalname}`);
      return {
        success: true,
        data: {
          url: result.url,
          key: result.key,
          name: result.name,
          isActive: result.isActive,
        },
      };
    } catch (error) {
      this.logger.error(`단일 이미지 업로드 실패: ${file?.originalname}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('이미지 업로드 중 오류가 발생했습니다.');
    }
  }
}
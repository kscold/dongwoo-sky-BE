import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../service/file.service';
import { AttachmentDto } from '../../notices/dto/attachment.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('notice/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentDto> {
    // 파일이 없는 경우 오류 처리
    if (!file) {
      throw new BadRequestException(
        '파일이 제공되지 않았습니다. 파일을 업로드해주세요.',
      );
    }

    // notices 폴더에 업로드하도록 지정
    console.log(`파일 업로드 요청: ${file.originalname}, 대상 폴더: notices`);

    // 현재 날짜로 서브폴더 구성 (YYYY-MM 형식)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadPath = `notices/${yearMonth}`;

    const result = await this.fileService.uploadFile(file, uploadPath, {
      compressImage: true,
      imageOptions: {
        quality: 80,
        width: 1920, // 최대 너비 제한
      },
      allowedExtensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'heic',
        'heif',
        'webp',
        'avif',
      ],
      maxSize: 15 * 1024 * 1024, // 15MB로 증가 (HEIC 파일은 더 큰 경향이 있음)
    });
    console.log(`파일 업로드 완료: ${result.key}`);

    return {
      url: result.url,
      key: result.key,
      name: file.originalname,
    };
  }

  @Post('notice/uploads')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 5)) // 최대 5개 파일 제한
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<AttachmentDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException(
        '업로드할 파일이 없습니다. 최소 1개 이상의 파일을 업로드해주세요.',
      );
    }

    console.log(
      `다중 파일 업로드 요청: ${files.length}개 파일, 대상 폴더: notices`,
    );

    // 현재 날짜로 서브폴더 구성 (YYYY-MM 형식)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadPath = `notices/${yearMonth}`;

    const attachments: AttachmentDto[] = [];

    for (const file of files) {
      const result = await this.fileService.uploadFile(file, uploadPath, {
        compressImage: true,
        imageOptions: {
          quality: 80,
          width: 1920, // 최대 너비 제한
        },
        allowedExtensions: [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'pdf',
          'doc',
          'docx',
          'xls',
          'xlsx',
          'heic',
          'heif',
          'webp',
          'avif',
        ],
        maxSize: 15 * 1024 * 1024, // 15MB로 증가 (HEIC 파일은 더 큰 경향이 있음)
      });
      console.log(`파일 업로드 완료: ${result.key}`);

      attachments.push({
        url: result.url,
        key: result.key,
        name: file.originalname,
      });
    }

    return attachments;
  }
}

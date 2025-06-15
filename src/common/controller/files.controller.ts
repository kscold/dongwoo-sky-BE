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
import { memoryStorage } from 'multer';
import { FileService } from '../service/file.service';
import { AttachmentDto } from '../../notices/dto/attachment.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('notice/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
      fileFilter: (req, file, cb) => {
        console.log(
          `받은 공지사항 파일: ${file.originalname}, MIME: ${file.mimetype}, 크기: ${file.size}`,
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
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log(`차단된 공지사항 파일 타입: ${file.mimetype}`);
          cb(
            new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentDto> {
    console.log(
      `공지사항 파일 업로드 요청: ${file?.originalname}, 크기: ${file?.size}바이트`,
    );

    // 파일 검증
    if (!file) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('파일 데이터가 비어있습니다.');
    }

    console.log(`파일 버퍼 크기: ${file.buffer.length}바이트`);

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
      maxSize: 20 * 1024 * 1024, // 20MB
    });
    console.log(`공지사항 파일 업로드 완료: ${result.key}`);

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
    console.log(
      `공지사항 다중 파일 업로드 요청: ${files?.length}개 파일, 대상 폴더: notices`,
    );

    if (!files || files.length === 0) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

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
        maxSize: 15 * 1024 * 1024, // 15MB
      });
      console.log(`공지사항 파일 업로드 완료: ${result.key}`);

      attachments.push({
        url: result.url,
        key: result.key,
        name: file.originalname,
      });
    }

    return attachments;
  }
}

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { FileService } from '../common/service/file.service';

import { AttachmentDto } from './dto/attachment.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FileService) {}

  @Post('notice/upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentDto> {
    // notices 폴더에 업로드하도록 지정
    console.log(`파일 업로드 요청: ${file.originalname}, 대상 폴더: notices`);

    // 현재 날짜로 서브폴더 구성 (YYYY-MM 형식)
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const uploadPath = `notices/${yearMonth}`;

    const result = await this.fileService.uploadFile(file, uploadPath);
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
      console.log('업로드할 파일이 없습니다.');
      return [];
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
      const result = await this.fileService.uploadFile(file, uploadPath);
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

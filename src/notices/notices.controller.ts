import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { FileService } from '../common/file.service';
import { AttachmentDto } from './dto/attachment.dto';

@Controller('notices')
export class NoticesController {
  constructor(
    private readonly noticesService: NoticesService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  findAll() {
    return this.noticesService.findAll();
  }

  @Get('published')
  findPublished() {
    return this.noticesService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentDto> {
    const result = await this.fileService.uploadFile(file, 'notices');
    return {
      url: result.url,
      key: result.key,
      name: file.originalname,
    };
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 5)) // 최대 5개 파일 제한
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<AttachmentDto[]> {
    const attachments: AttachmentDto[] = [];

    for (const file of files) {
      const result = await this.fileService.uploadFile(file, 'notices');
      attachments.push({
        url: result.url,
        key: result.key,
        name: file.originalname,
      });
    }

    return attachments;
  }
}

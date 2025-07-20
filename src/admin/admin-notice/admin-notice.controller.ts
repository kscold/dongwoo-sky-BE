import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFiles,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';
import { fileUploadOptions } from '../../common/config/file-upload.config';

import { AdminNoticeService } from './admin-notice.service';

import { AdminNoticeCreateRequestDto } from './dto/request/admin-notice-create-request.dto';
import { AdminNoticeUpdateRequestDto } from './dto/request/admin-notice-update-request.dto';
import { AdminNoticeResponseDto } from './dto/response/admin-notice.response.dto';

@UseGuards(AdminAuthGuard)
@Controller('admin/notice')
export class AdminNoticeController {
    constructor(private readonly adminNoticeService: AdminNoticeService) {}

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<{ data: AdminNoticeResponseDto[]; total: number }> {
        return await this.adminNoticeService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<AdminNoticeResponseDto> {
        return await this.adminNoticeService.findOne(id);
    }

    @Post()
    async create(
        @Body() createNoticeDto: AdminNoticeCreateRequestDto,
    ): Promise<AdminNoticeResponseDto> {
        return await this.adminNoticeService.create(createNoticeDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateNoticeDto: AdminNoticeUpdateRequestDto,
    ): Promise<AdminNoticeResponseDto> {
        return await this.adminNoticeService.update(id, updateNoticeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return await this.adminNoticeService.remove(id);
    }

    @Post('upload-attachments')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions))
    async uploadAttachments(@UploadedFiles() files: Express.Multer.File[]) {
        return await this.adminNoticeService.uploadAttachments(files);
    }
}

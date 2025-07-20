import {
    Controller,
    Get,
    Body,
    Patch,
    UseGuards,
    HttpCode,
    HttpStatus,
    Post,
    UseInterceptors,
    UploadedFiles,
    Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AdminAuthGuard } from 'src/common/guard/admin-auth.guard';
import { fileUploadOptions } from 'src/common/config/file-upload.config';

import { AdminServiceGuideService } from './admin-service-guide.service';

import { ServiceGuideDocument } from '../../schema/service-guide.schema';

import { UpdateServiceGuideDto } from './dto/update-service-guide.dto';
import { ApiResponseDto } from '../../common/dto/response/api-response.dto';

@Controller('admin/service-guide')
@UseGuards(AdminAuthGuard)
export class AdminServiceGuideController {
    constructor(
        private readonly adminServiceGuideService: AdminServiceGuideService,
    ) {}

    @Get()
    async getServiceGuide(): Promise<ServiceGuideDocument> {
        return await this.adminServiceGuideService.findOrCreateServiceGuide();
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    async updateServiceGuide(@Body() updateDto: UpdateServiceGuideDto) {
        return await this.adminServiceGuideService.updateServiceGuide(
            updateDto,
        );
    }

    @Post('upload-profile-image')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files', 1, fileUploadOptions))
    async uploadProfileImage(@UploadedFiles() files: Express.Multer.File[]) {
        return this.adminServiceGuideService.uploadProfileImage(files[0]);
    }

    @Delete('profile-image')
    async deleteProfileImage(@Body() body: { imageUrl: string }) {
        return this.adminServiceGuideService.deleteProfileImage(body.imageUrl);
    }
}

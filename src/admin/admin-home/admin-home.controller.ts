import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    HttpStatus,
    HttpCode,
    UseInterceptors,
    UploadedFiles,
    Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';

import { fileUploadOptions } from '../../common/config/file-upload.config';

import { AdminHomeService } from './admin-home.service';

import { UserRole } from '../../schema/user.schema';

import { AdminHomeUpdateDto } from './dto/request/admin-home-update.dto';
import { AdminHomeResponseDto } from './dto/response/admin-home.response.dto';

@Controller('admin/home')
export class AdminHomeController {
    constructor(private readonly adminHomeService: AdminHomeService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async fetchHomeSettings(): Promise<AdminHomeResponseDto> {
        const result = await this.adminHomeService.fetchHomeSettings();

        return result.data;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async upsertHomeSettings(
        @Body() homeDto: AdminHomeUpdateDto,
    ): Promise<AdminHomeResponseDto> {
        const result = await this.adminHomeService.upsertHomeSettings(homeDto);
        return result.data;
    }

    @Post('upload-hero-images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions))
    async uploadHeroImages(@UploadedFiles() files: Express.Multer.File[]) {
        return this.adminHomeService.uploadHeroImages(files);
    }

    @Delete('hero-images')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteHeroImage(@Body() body: { imageUrl: string }) {
        return this.adminHomeService.deleteHeroImage(body.imageUrl);
    }
}

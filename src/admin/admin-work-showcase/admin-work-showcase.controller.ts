import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ApiResponseInterceptor } from '../../common/interceptor/api-response.interceptor';

import { FileService } from '../../common/file/file.service';
import { AdminWorkShowcaseService } from './admin-work-showcase.service';

import { UserRole } from '../../schema/user.schema';

import { AdminWorkShowcaseCreateRequestDto } from './dto/request/admin-work-showcase-create-request.dto';
import { AdminWorkShowcaseUpdateRequestDto } from './dto/request/admin-work-showcase-update-request.dto.dto';
import { AdminWorkShowcaseResponseDto } from './dto/response/admin-work-showcase-response.dto';
import { AdminWorkShowcaseListResponseDto } from './dto/response/admin-work-showcase-list-response.dto';

@Controller('admin/work-showcase')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(ApiResponseInterceptor)
export class AdminWorkShowcaseController {
    constructor(
        private readonly adminWorkShowcaseService: AdminWorkShowcaseService,
        private readonly fileService: FileService,
    ) { }

    @Post()
    async create(
        @Body() createWorkShowcaseDto: AdminWorkShowcaseCreateRequestDto,
    ): Promise<AdminWorkShowcaseResponseDto> {
        const workShowcase = await this.adminWorkShowcaseService.create(
            createWorkShowcaseDto,
        );
        return new AdminWorkShowcaseResponseDto(workShowcase);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<AdminWorkShowcaseListResponseDto> {
        const result = await this.adminWorkShowcaseService.findAll(page, limit);
        return new AdminWorkShowcaseListResponseDto(result);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ): Promise<AdminWorkShowcaseResponseDto> {
        const workShowcase = await this.adminWorkShowcaseService.findOne(id);
        return new AdminWorkShowcaseResponseDto(workShowcase);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateWorkShowcaseDto: AdminWorkShowcaseUpdateRequestDto,
    ): Promise<AdminWorkShowcaseResponseDto> {
        const workShowcase = await this.adminWorkShowcaseService.update(
            id,
            updateWorkShowcaseDto,
        );
        return new AdminWorkShowcaseResponseDto(workShowcase);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        await this.adminWorkShowcaseService.remove(id);
    }

    @Post('upload-images')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<{ imageUrls: string[] }> {
        const uploadResults = await Promise.all(
            files.map((file) => this.fileService.uploadFile(file, 'work-showcase', {
                compressImage: true,
                imageOptions: {
                    quality: 85,
                    width: 1920,
                },
                allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'avif'],
                maxSize: 15 * 1024 * 1024, // 15MB
            })),
        );
        const imageUrls = uploadResults.map(result => result.url);
        return { imageUrls };
    }
} 
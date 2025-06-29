import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { fileUploadOptions } from '../../common/file/file-upload.config';
import { AdminAuthGuard } from '../admin-user/guard/admin-auth.guard';

import { EquipmentService } from './admin-equipment.service';
import { FileService } from '../../common/file/file.service';

import { AdminEquipmentCreateDto } from './dto/request/admin-equipment-create.dto';
import { AdminEquipmentUpdateDto } from './dto/request/admin-equipment-update.dto';
import { AdminEquipmentResponseDto } from './dto/response/admin-equipment.response.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async findAll(): Promise<AdminEquipmentResponseDto[]> {
    const result = await this.equipmentService.findAll();
    return result.data;
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  async findAllAdmin(): Promise<AdminEquipmentResponseDto[]> {
    const result = await this.equipmentService.findAllAdmin();
    return result.data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminEquipmentResponseDto> {
    const result = await this.equipmentService.findOne(id);
    return result.data;
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(
    @Body() createEquipmentDto: AdminEquipmentCreateDto,
  ): Promise<AdminEquipmentResponseDto> {
    const result = await this.equipmentService.create(createEquipmentDto);
    return result.data;
  }

  @Post('upload-image')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    // 단일 파일만 허용
    return this.equipmentService.uploadImage(file);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: AdminEquipmentUpdateDto,
  ): Promise<AdminEquipmentResponseDto> {
    const result = await this.equipmentService.update(id, updateEquipmentDto);
    return result.data;
  }

  @Put('sort-order')
  @UseGuards(AdminAuthGuard)
  async updateSortOrder(@Body() { equipmentIds }: { equipmentIds: string[] }) {
    return this.equipmentService.updateSortOrder(equipmentIds);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}

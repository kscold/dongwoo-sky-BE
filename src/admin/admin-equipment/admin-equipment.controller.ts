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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { fileUploadOptions } from '../../common/config/file-upload.config';

import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';

import { EquipmentService } from './admin-equipment.service';
import { FileService } from '../../common/file/file.service';

import { AdminEquipmentCreateRequestDto } from './dto/request/admin-equipment-create-request.dto';
import { AdminEquipmentUpdateRequestDto } from './dto/request/admin-equipment-update-request.dto';
import { AdminEquipmentResponseDto } from './dto/response/admin-equipment-response.dto';

@Controller('admin/equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async findAll(): Promise<AdminEquipmentResponseDto[]> {
    return this.equipmentService.findAll();
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  async findAllAdmin(): Promise<AdminEquipmentResponseDto[]> {
    return this.equipmentService.findAllAdmin();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminEquipmentResponseDto> {
    return this.equipmentService.findOne(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async create(
    @Body() createEquipmentDto: AdminEquipmentCreateRequestDto,
  ): Promise<AdminEquipmentResponseDto> {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Post('upload-image')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.equipmentService.uploadImage(file);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: AdminEquipmentUpdateRequestDto,
  ): Promise<AdminEquipmentResponseDto> {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Patch('sort-order')
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

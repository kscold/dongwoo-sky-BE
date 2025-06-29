import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { AdminAuthGuard } from '../../common/guard/admin-auth.guard';

import { ServiceService } from './admin-service-setting.service';

import { AdminServiceSettingCreateRequestDto } from './dto/request/admin-service-setting-create.request.dto';
import { AdminServiceSettingUpdateRequestDto } from './dto/request/admin-service-setting-update.request.dto';
import { AdminServiceSettingResponseDto } from './dto/response/admin-service-setting.response.dto';

@Controller('admin/service-setting')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async findAll(): Promise<AdminServiceSettingResponseDto[]> {
    const result = await this.serviceService.findAll();
    return result.map((service) => this.toResponseDto(service));
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  async findAllAdmin(): Promise<AdminServiceSettingResponseDto[]> {
    const result = await this.serviceService.findAllAdmin();
    return result.map((service) => this.toResponseDto(service));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<AdminServiceSettingResponseDto> {
    const service = await this.serviceService.findOne(id);
    return this.toResponseDto(service);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createServiceDto: AdminServiceSettingCreateRequestDto,
  ): Promise<AdminServiceSettingResponseDto> {
    const created = await this.serviceService.create(createServiceDto);
    return this.toResponseDto(created);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: AdminServiceSettingUpdateRequestDto,
  ): Promise<AdminServiceSettingResponseDto> {
    const updated = await this.serviceService.update(id, updateServiceDto);
    return this.toResponseDto(updated);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async remove(
    @Param('id') id: string,
  ): Promise<AdminServiceSettingResponseDto> {
    const removed = await this.serviceService.remove(id);
    return this.toResponseDto(removed);
  }

  private toResponseDto(service: any): AdminServiceSettingResponseDto {
    return {
      id: service._id?.toString?.() ?? service.id,
      title: service.title,
      description: service.description,
      isActive: service.isActive,
      sortOrder: service.sortOrder,
      icon: service.icon,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      metaKeywords: service.metaKeywords,
    };
  }
}

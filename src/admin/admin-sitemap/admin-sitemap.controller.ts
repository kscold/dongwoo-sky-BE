import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';

import { AdminSitemapService } from './admin-sitemap.service';

import { UserRole } from '../../schema/user.schema';

import { CreateSitemapConfigDto } from './dto/request/create-sitemap-config.dto';
import { UpdateSitemapConfigDto } from './dto/request/update-sitemap-config.dto';
import { SitemapConfigResponseDto } from './dto/response/sitemap-config-response.dto';

@Controller('admin/sitemap')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSitemapController {
  constructor(private readonly adminSitemapService: AdminSitemapService) {}

  @Get()
  async getAllSitemapConfigs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('type') type?: 'static' | 'dynamic',
    @Query('isActive') isActive?: boolean,
  ): Promise<{
    configs: SitemapConfigResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.adminSitemapService.getAllSitemapConfigs(
      page,
      limit,
      search,
      category,
      type,
      isActive,
    );
  }

  @Get(':id')
  async getSitemapConfig(
    @Param('id') id: string,
  ): Promise<SitemapConfigResponseDto> {
    return this.adminSitemapService.getSitemapConfig(id);
  }

  @Post()
  async createSitemapConfig(
    @Body() createSitemapConfigDto: CreateSitemapConfigDto,
  ): Promise<SitemapConfigResponseDto> {
    return this.adminSitemapService.createSitemapConfig(createSitemapConfigDto);
  }

  @Put(':id')
  async updateSitemapConfig(
    @Param('id') id: string,
    @Body() updateSitemapConfigDto: UpdateSitemapConfigDto,
  ): Promise<SitemapConfigResponseDto> {
    return this.adminSitemapService.updateSitemapConfig(
      id,
      updateSitemapConfigDto,
    );
  }

  @Delete(':id')
  async deleteSitemapConfig(@Param('id') id: string): Promise<void> {
    return this.adminSitemapService.deleteSitemapConfig(id);
  }

  @Post('generate')
  async generateSitemap(): Promise<{ message: string; url: string }> {
    const sitemapUrl = await this.adminSitemapService.generateSitemap();
    return {
      message: 'Sitemap generated successfully',
      url: sitemapUrl,
    };
  }

  @Post('initialize-default')
  async initializeDefaultSitemapConfigs(): Promise<{
    message: string;
    count: number;
  }> {
    const count =
      await this.adminSitemapService.initializeDefaultSitemapConfigs();
    return {
      message: 'Default sitemap configurations initialized',
      count,
    };
  }

  @Get('preview/sitemap.xml')
  async previewSitemap(): Promise<string> {
    return this.adminSitemapService.generateSitemapXml();
  }
}

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

import { AdminSeoService } from './admin-seo.service';

import { UserRole } from '../../schema/user.schema';

import { CreatePageSeoDto } from './dto/request/create-page-seo.dto';
import { UpdatePageSeoDto } from './dto/request/update-page-seo.dto';
import { PageSeoResponseDto } from './dto/response/page-seo-response.dto';

@Controller('admin/seo')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSeoController {
  constructor(private readonly adminSeoService: AdminSeoService) {}

  @Get()
  async getAllPageSeo(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<{
    seoData: PageSeoResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.adminSeoService.getAllPageSeo(page, limit, search, isActive);
  }

  @Get(':id')
  async getPageSeo(@Param('id') id: string): Promise<PageSeoResponseDto> {
    return this.adminSeoService.getPageSeo(id);
  }

  @Get('by-url/:url')
  async getPageSeoByUrl(
    @Param('url') url: string,
  ): Promise<PageSeoResponseDto> {
    return this.adminSeoService.getPageSeoByUrl(decodeURIComponent(url));
  }

  @Post()
  async createPageSeo(
    @Body() createPageSeoDto: CreatePageSeoDto,
  ): Promise<PageSeoResponseDto> {
    return this.adminSeoService.createPageSeo(createPageSeoDto);
  }

  @Put(':id')
  async updatePageSeo(
    @Param('id') id: string,
    @Body() updatePageSeoDto: UpdatePageSeoDto,
  ): Promise<PageSeoResponseDto> {
    return this.adminSeoService.updatePageSeo(id, updatePageSeoDto);
  }

  @Delete(':id')
  async deletePageSeo(@Param('id') id: string): Promise<void> {
    return this.adminSeoService.deletePageSeo(id);
  }

  @Post('initialize-default')
  async initializeDefaultPageSeo(): Promise<{
    message: string;
    count: number;
  }> {
    const count = await this.adminSeoService.initializeDefaultPageSeo();
    return {
      message: 'Default SEO configurations initialized',
      count,
    };
  }

  @Post('generate-meta-tags/:id')
  async generateMetaTags(
    @Param('id') id: string,
  ): Promise<{ metaTags: string }> {
    const metaTags = await this.adminSeoService.generateMetaTags(id);
    return { metaTags };
  }
}

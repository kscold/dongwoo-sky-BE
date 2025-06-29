import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/decorator/roles.decorator';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

import { AdminSiteSettingService } from './admin-site-setting.service';

import { UserRole } from '../../schema/user.schema';

import { SiteSettingResponseDto } from './dto/response/site-setting-response.dto';
import { UpdateSiteSettingDto } from './dto/request/update-site-setting.dto';

@Controller('admin/site-setting')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminSiteSettingController {
  constructor(private readonly siteSettingService: AdminSiteSettingService) {}

  @Get()
  async getSiteSettings(): Promise<SiteSettingResponseDto> {
    return this.siteSettingService.getSiteSettings();
  }

  @Patch()
  async updateSiteSettings(
    @Body() dto: UpdateSiteSettingDto,
  ): Promise<SiteSettingResponseDto> {
    return this.siteSettingService.updateSiteSettings(dto);
  }
}

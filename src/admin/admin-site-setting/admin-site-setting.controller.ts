import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"


import { ApiResponseInterceptor } from "../../common/interceptor/api-response.interceptor"
import { AdminAuthGuard } from "../../common/guard/admin-auth.guard"

import { AdminSiteSettingService } from "./admin-site-setting.service"

import { UpdateSiteSettingDto } from "./dto/request/update-site-setting-request.dto"

@Controller("admin/site-setting")
@UseGuards(AdminAuthGuard)
@UseInterceptors(ApiResponseInterceptor)
export class AdminSiteSettingController {
  constructor(private readonly siteSettingService: AdminSiteSettingService) { }

  @Get()
  async getSiteSettings() {
    return this.siteSettingService.findOrCreate()
  }

  @Patch()
  async updateSiteSettings(@Body() dto: UpdateSiteSettingDto) {
    return this.siteSettingService.update(dto)
  }
}

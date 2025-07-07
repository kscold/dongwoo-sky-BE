import { Controller, Get, UseInterceptors } from "@nestjs/common"
import { SiteSettingService } from "./site-setting.service"
import { ApiResponseInterceptor } from "src/common/interceptor/api-response.interceptor"

@Controller("service/site-setting")
@UseInterceptors(ApiResponseInterceptor)
export class SiteSettingController {
    constructor(private readonly siteSettingService: SiteSettingService) { }

    @Get("seo")
    async getSeoSettings() {
        return this.siteSettingService.getSeoSettings()
    }

    @Get("contact")
    async getContactInfo() {
        return this.siteSettingService.getContactInfo()
    }
} 
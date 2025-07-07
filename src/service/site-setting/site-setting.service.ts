import { Injectable, Logger } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import {
    SiteSetting,
    SiteSettingDocument,
} from "src/schema/site-setting.schema"
import { SeoSettingsResponseDto } from "./dto/response/seo-settings.response.dto"
import { ContactInfoResponseDto } from "./dto/response/contact-info.response.dto"

const SITE_SETTING_KEY = "global_settings"

@Injectable()
export class SiteSettingService {
    private readonly logger = new Logger(SiteSettingService.name)

    constructor(
        @InjectModel(SiteSetting.name)
        private readonly siteSettingModel: Model<SiteSettingDocument>,
    ) { }

    private async findOrCreate(): Promise<SiteSettingDocument> {
        this.logger.log("Attempting to find or create site settings for service...")
        let settings = await this.siteSettingModel
            .findOne({ key: SITE_SETTING_KEY })
            .exec()

        if (settings) {
            this.logger.log(`Found existing site settings for service.`)
        } else {
            this.logger.log("No site settings found. Creating new ones for service...")
            settings = new this.siteSettingModel({
                key: SITE_SETTING_KEY,
                contactPhoneNumber: "010-1234-5678",
                kakaoOpenChatUrl: "https://open.kakao.com/o/example",
                metaTitle: "어울림스카이 | 중장비 임대, 스카이차, 크레인",
                metaDescription:
                    "안전하고 신속한 중장비 임대 서비스. 스카이차, 크레인, 사다리차 등 최신 장비 보유. 지금 바로 견적 문의하세요.",
                metaKeywords:
                    "스카이차, 크레인, 고소작업차, 중장비임대, 어울림스카이",
                companyName: "어울림스카이",
                businessRegistrationNumber: "123-45-67890",
                address: "경기도 용인시 처인구",
            })
            try {
                await settings.save()
                this.logger.log("Successfully saved new site settings for service.")
            } catch (error) {
                this.logger.error(
                    "Failed to save new site settings for service.",
                    error.stack,
                )
                throw error
            }
        }
        return settings
    }

    async getSeoSettings(): Promise<SeoSettingsResponseDto> {
        const settings = await this.findOrCreate()
        return {
            metaTitle: settings.metaTitle,
            metaDescription: settings.metaDescription,
            metaKeywords: settings.metaKeywords,
        }
    }

    async getContactInfo(): Promise<ContactInfoResponseDto> {
        const settings = await this.findOrCreate()
        return {
            contactPhoneNumber: settings.contactPhoneNumber,
            kakaoOpenChatUrl: settings.kakaoOpenChatUrl,
        }
    }
} 
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    SiteSetting,
    SiteSettingDocument,
} from '../../schema/site-setting.schema';

import { SeoSettingsResponseDto } from './dto/response/seo-settings.response.dto';
import { ContactInfoResponseDto } from './dto/response/contact-info.response.dto';

const SITE_SETTING_KEY = 'global_settings';

@Injectable()
export class SiteSettingService {
    private readonly logger = new Logger(SiteSettingService.name);

    constructor(
        @InjectModel(SiteSetting.name)
        private readonly siteSettingModel: Model<SiteSettingDocument>,
    ) {}

    async getSeoSettings(): Promise<SeoSettingsResponseDto> {
        try {
            const settings = await this.findOrCreate();
            return {
                seoTitle: settings.metaTitle,
                seoDescription: settings.metaDescription,
                seoKeywords: settings.metaKeywords
                    ? settings.metaKeywords.split(',').map((k) => k.trim())
                    : [],
            };
        } catch (error) {
            this.logger.error(
                '[getSeoSettings] 사이트 설정 데이터 조회 실패',
                error.stack,
            );
            throw error;
        }
    }

    async getContactInfo(): Promise<ContactInfoResponseDto> {
        try {
            const settings = await this.findOrCreate();

            return {
                contactPhoneNumber: settings.contactPhoneNumber,
                kakaoOpenChatUrl: settings.kakaoOpenChatUrl,
            };
        } catch (error) {
            this.logger.error(
                '[getContactInfo] 사이트 설정 데이터 조회 실패',
                error.stack,
            );
            throw error;
        }
    }

    private async findOrCreate(): Promise<SiteSettingDocument> {
        try {
            this.logger.log(
                '[findOrCreate] 사이트 설정 데이터 조회 또는 생성 시작',
            );
            const settings = await this.siteSettingModel
                .findOne({ key: SITE_SETTING_KEY })
                .exec();

            if (!settings) {
                throw new BadRequestException('사이트 설정 데이터가 없습니다.');
            }

            return settings;
        } catch (error) {
            this.logger.error(
                'Failed to find or create site settings for service.',
                error.stack,
            );
            throw error;
        }
    }
}

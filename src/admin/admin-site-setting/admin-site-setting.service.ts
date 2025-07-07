import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSetting, SiteSettingDocument } from '../../schema/site-setting.schema';
import { UpdateSiteSettingDto } from './dto/request/update-site-setting-request.dto';

const SITE_SETTING_KEY = 'global_settings';

@Injectable()
export class AdminSiteSettingService {
  private readonly logger = new Logger(AdminSiteSettingService.name);

  constructor(
    @InjectModel(SiteSetting.name)
    private readonly siteSettingModel: Model<SiteSettingDocument>,
  ) { }

  async findOrCreate(): Promise<SiteSettingDocument> {
    this.logger.log('Attempting to find or create site settings...');
    let settings = await this.siteSettingModel
      .findOne({ key: SITE_SETTING_KEY })
      .exec();

    if (settings) {
      this.logger.log(`Found existing site settings. ID: ${settings._id}`);
    } else {
      this.logger.log('No site settings found. Creating new ones...');
      settings = new this.siteSettingModel({
        key: SITE_SETTING_KEY,
        contactPhoneNumber: '010-1234-5678',
        kakaoOpenChatUrl: 'https://open.kakao.com/o/example',
        metaTitle: '어울림스카이 | 중장비 임대, 스카이차, 크레인',
        metaDescription:
          '안전하고 신속한 중장비 임대 서비스. 스카이차, 크레인, 사다리차 등 최신 장비 보유. 지금 바로 견적 문의하세요.',
        metaKeywords:
          '스카이차, 크레인, 고소작업차, 중장비임대, 어울림스카이',
        companyName: '어울림스카이',
        businessRegistrationNumber: '123-45-67890',
        address: '경기도 용인시 처인구',
      });
      try {
        await settings.save();
        this.logger.log('Successfully saved new site settings.');
      } catch (error) {
        this.logger.error('Failed to save new site settings.', error.stack);
        throw error;
      }
    }
    return settings;
  }

  async update(
    updateDto: UpdateSiteSettingDto,
  ): Promise<SiteSettingDocument> {
    const updated = await this.siteSettingModel
      .findOneAndUpdate({ key: SITE_SETTING_KEY }, { $set: updateDto }, {
        new: true,
        upsert: true,
      })
      .exec();
    this.logger.log('Site settings updated successfully.');
    return updated;
  }
}

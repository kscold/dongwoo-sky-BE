import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSetting, SiteSettingDocument } from '../../schema/site-setting.schema';
import { UpdateSiteSettingDto } from './dto/request/update-site-setting.dto';

@Injectable()
export class AdminSiteSettingService {
  private readonly settingIdentifier = 'global_settings';

  constructor(
    @InjectModel(SiteSetting.name)
    private siteSettingModel: Model<SiteSettingDocument>,
  ) {}

  async getSiteSettings(): Promise<SiteSetting> {
    return this.findOrCreate();
  }

  async updateSiteSettings(dto: UpdateSiteSettingDto): Promise<SiteSetting> {
    const settings = await this.findOrCreate();
    Object.assign(settings, dto);
    return settings.save();
  }

  private async findOrCreate(): Promise<SiteSettingDocument> {
    let settings = await this.siteSettingModel.findOne({
      identifier: this.settingIdentifier,
    });
    if (!settings) {
      settings = new this.siteSettingModel({
        identifier: this.settingIdentifier,
      });
      await settings.save();
    }
    return settings;
  }
}

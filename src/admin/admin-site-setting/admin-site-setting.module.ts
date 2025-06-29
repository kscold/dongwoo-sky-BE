import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSetting, SiteSettingSchema } from '../../schema/site-setting.schema';
import { AdminSiteSettingController } from './admin-site-setting.controller';
import { AdminSiteSettingService } from './admin-site-setting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteSetting.name, schema: SiteSettingSchema },
    ]),
  ],
  controllers: [AdminSiteSettingController],
  providers: [AdminSiteSettingService],
  exports: [AdminSiteSettingService],
})
export class AdminSiteSettingModule {}

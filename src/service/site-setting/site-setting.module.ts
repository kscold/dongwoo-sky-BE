import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SiteSettingController } from './site-setting.controller';

import { SiteSettingService } from './site-setting.service';

import {
    SiteSetting,
    SiteSettingSchema,
} from '../../schema/site-setting.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SiteSetting.name, schema: SiteSettingSchema },
        ]),
    ],
    controllers: [SiteSettingController],
    providers: [SiteSettingService],
    exports: [SiteSettingService],
})
export class SiteSettingModule {}

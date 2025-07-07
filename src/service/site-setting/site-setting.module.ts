import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import {
    SiteSetting,
    SiteSettingSchema,
} from "src/schema/site-setting.schema"
import { SiteSettingController } from "./site-setting.controller"
import { SiteSettingService } from "./site-setting.service"

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
export class SiteSettingModule { } 
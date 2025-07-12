import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminPricingSettingController } from './admin-pricing-setting.controller';
import { AdminPricingSettingService } from './admin-pricing-setting.service';
import { PricingSetting, PricingSettingSchema } from '../../schema/pricing-setting.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PricingSetting.name, schema: PricingSettingSchema },
        ]),
    ],
    controllers: [AdminPricingSettingController],
    providers: [AdminPricingSettingService],
    exports: [AdminPricingSettingService],
})
export class AdminPricingSettingModule { } 
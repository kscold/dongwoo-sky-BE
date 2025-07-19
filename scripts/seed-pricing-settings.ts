import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PricingSetting, PricingSettingDocument } from '../src/schema/pricing-setting.schema';
import { DEFAULT_PRICING_SETTINGS } from '../src/common/constants/default-pricing-settings.constant';

async function seedPricingSettings() {
    const app = await NestFactory.create(AppModule);
    
    const pricingSettingModel = app.get<Model<PricingSettingDocument>>('PricingSettingModel');
    
    try {
        const existingSettings = await pricingSettingModel.findOne({ isActive: true });
        
        if (!existingSettings) {
            await pricingSettingModel.create(DEFAULT_PRICING_SETTINGS);
            console.log('✅ Default pricing settings seeded successfully');
        } else {
            console.log('⚠️ Pricing settings already exist, skipping seed');
        }
    } catch (error) {
        console.error('❌ Error seeding pricing settings:', error);
    } finally {
        await app.close();
    }
}

seedPricingSettings();
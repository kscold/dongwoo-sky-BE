import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { Equipment, EquipmentSchema } from '../../schema/equipment.schema';
import { PricingSetting, PricingSettingSchema } from '../../schema/pricing-setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
      { name: PricingSetting.name, schema: PricingSettingSchema },
    ]),
  ],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}

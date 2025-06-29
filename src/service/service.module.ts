import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceGuideController } from './service-guide/service-guide.controller';
import { ServiceGuideService } from './service-guide/service-guide.service';
import { Equipment, EquipmentSchema } from '../schema/equipment.schema';
import { PricingController } from './pricing/pricing.controller';
import { PricingService } from './pricing/pricing.service';
import { VehicleType, VehicleTypeSchema } from '../schema/vehicle-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Equipment.name, schema: EquipmentSchema },
        { name: VehicleType.name, schema: VehicleTypeSchema },
      ],
      'default',
    ),
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [ServiceGuideController, PricingController],
  providers: [ServiceGuideService, PricingService],
})
export class ServiceModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceGuideController } from './service-guide.controller';
import { ServiceGuideService } from './service-guide.service';
import { Equipment, EquipmentSchema } from '../../schema/equipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Equipment.name, schema: EquipmentSchema }]),
  ],
  controllers: [ServiceGuideController],
  providers: [ServiceGuideService],
})
export class ServiceGuideModule {}

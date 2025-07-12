import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceGuideController } from './service-guide.controller';
import { ServiceGuideService } from './service-guide.service';
import { Equipment, EquipmentSchema } from '../../schema/equipment.schema';
import {
  ServiceGuide,
  ServiceGuideSchema,
} from 'src/schema/service-guide.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
      { name: ServiceGuide.name, schema: ServiceGuideSchema },
    ]),
  ],
  controllers: [ServiceGuideController],
  providers: [ServiceGuideService],
})
export class ServiceGuideModule { }

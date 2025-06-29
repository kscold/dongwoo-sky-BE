import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleType, VehicleTypeSchema } from './schema/vehicle-type.schema';
import { AdminModule } from '../admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VehicleType.name,
        schema: VehicleTypeSchema,
        collection: 'vehicles',
      },
    ]),
    AdminModule,
  ],
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService],
  exports: [VehicleTypeService],
})
export class VehicleTypeModule {}

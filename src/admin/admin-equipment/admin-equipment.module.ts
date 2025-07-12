import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentController } from './admin-equipment.controller';

import { EquipmentService } from './admin-equipment.service';

import { Equipment, EquipmentSchema } from '../../schema/equipment.schema';

import { CommonModule } from '../../common/common.module';
import { AdminUserModule } from '../admin-user/admin-user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
    CommonModule,
    AdminUserModule,
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class AdminEquipmentModule {} 
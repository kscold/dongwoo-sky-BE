import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminStatsController } from './admin-stats.controller';
import { AdminStatsService } from './admin-stats.service';

import { Notice, NoticeSchema } from '../../schema/notice.schema';
import { Equipment, EquipmentSchema } from '../../schema/equipment.schema';
import { WorkShowcase, WorkShowcaseSchema } from '../../schema/work-showcase.schema';
import { CustomerReview, CustomerReviewSchema } from '../../schema/customer-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notice.name, schema: NoticeSchema },
      { name: Equipment.name, schema: EquipmentSchema },
      { name: WorkShowcase.name, schema: WorkShowcaseSchema },
      { name: CustomerReview.name, schema: CustomerReviewSchema },
    ]),
  ],
  controllers: [AdminStatsController],
  providers: [AdminStatsService],
  exports: [AdminStatsService],
})
export class AdminStatsModule {}
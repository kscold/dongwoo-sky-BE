import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HomeController } from './home.controller';

import { HomeService } from './home.service';

import { Home, HomeSchema } from '../../schema/home.schema';
import { Notice, NoticeSchema } from '../../schema/notice.schema';
import {
  WorkShowcase,
  WorkShowcaseSchema,
} from '../../schema/work-showcase.schema';
import {
  CustomerReview,
  CustomerReviewSchema,
} from '../../schema/customer-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Home.name, schema: HomeSchema },
      { name: Notice.name, schema: NoticeSchema },
      { name: WorkShowcase.name, schema: WorkShowcaseSchema },
      { name: CustomerReview.name, schema: CustomerReviewSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

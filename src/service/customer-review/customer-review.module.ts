import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerReviewController } from './customer-review.controller';

import { CustomerReviewService } from './customer-review.service';

import {
    CustomerReview,
    CustomerReviewSchema,
} from '../../schema/customer-review.schema';

import { FileModule } from '../../common/file/file.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CustomerReview.name, schema: CustomerReviewSchema },
        ]),
        FileModule,
    ],
    controllers: [CustomerReviewController],
    providers: [CustomerReviewService],
    exports: [CustomerReviewService],
})
export class CustomerReviewModule {}

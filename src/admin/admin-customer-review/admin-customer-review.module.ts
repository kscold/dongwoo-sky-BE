import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerReviewController } from './admin-customer-review.controller';

import { AdminCustomerReviewService } from './admin-customer-review.service';

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
    providers: [AdminCustomerReviewService],
    exports: [AdminCustomerReviewService],
})
export class AdminCustomerReviewModule {}

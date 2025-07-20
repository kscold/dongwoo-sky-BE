import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notice, NoticeDocument } from '../../schema/notice.schema';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import {
    WorkShowcase,
    WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';
import {
    CustomerReview,
    CustomerReviewDocument,
} from '../../schema/customer-review.schema';

@Injectable()
export class AdminStatsService {
    private readonly logger = new Logger(AdminStatsService.name);

    constructor(
        @InjectModel(Notice.name)
        private noticeModel: Model<NoticeDocument>,
        @InjectModel(Equipment.name)
        private equipmentModel: Model<EquipmentDocument>,
        @InjectModel(WorkShowcase.name)
        private workShowcaseModel: Model<WorkShowcaseDocument>,
        @InjectModel(CustomerReview.name)
        private customerReviewModel: Model<CustomerReviewDocument>,
    ) {}

    async getOverallStats() {
        try {
            this.logger.log('[getOverallStats] 통계 조회 요청');
            const [
                totalNotices,
                publishedNotices,
                totalEquipment,
                activeEquipment,
                totalWorkShowcases,
                activeWorkShowcases,
                totalCustomerReviews,
                activeCustomerReviews,
            ] = await Promise.all([
                this.noticeModel.countDocuments().exec(),
                this.noticeModel.countDocuments({ isPublished: true }).exec(),
                this.equipmentModel.countDocuments().exec(),
                this.equipmentModel.countDocuments({ isActive: true }).exec(),
                this.workShowcaseModel.countDocuments().exec(),
                this.workShowcaseModel
                    .countDocuments({ isActive: true })
                    .exec(),
                this.customerReviewModel.countDocuments().exec(),
                this.customerReviewModel
                    .countDocuments({ isActive: true })
                    .exec(),
            ]);

            return {
                notices: {
                    total: totalNotices,
                    published: publishedNotices,
                },
                equipment: {
                    total: totalEquipment,
                    active: activeEquipment,
                },
                workShowcases: {
                    total: totalWorkShowcases,
                    active: activeWorkShowcases,
                },
                customerReviews: {
                    total: totalCustomerReviews,
                    active: activeCustomerReviews,
                },
            };
        } catch (error) {
            this.logger.error(
                `[getOverallStats] 통계 조회 중 오류 발생: ${error}`,
            );
            throw new BadRequestException(`통계 조회 실패: ${error}`);
        }
    }
}

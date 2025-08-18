import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    CustomerReview,
    CustomerReviewDocument,
} from '../../schema/customer-review.schema';
import { PaginatedResponse } from '../../common/dto/common.dto';
import { FileService } from '../../common/file/file.service';

@Injectable()
export class CustomerReviewService {
    private readonly logger = new Logger(CustomerReviewService.name);

    constructor(
        @InjectModel(CustomerReview.name)
        private readonly customerReviewModel: Model<CustomerReviewDocument>,
        private readonly fileService: FileService,
    ) {}

    /**
     * 활성화된 고객 리뷰 목록 조회 (공개용)
     */
    async findAllForService(
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResponse<any>> {
        try {
            const skip = (page - 1) * limit;

            const [items, totalItems] = await Promise.all([
                this.customerReviewModel
                    .find({ isActive: true })
                    .sort({ publishedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.customerReviewModel
                    .countDocuments({ isActive: true })
                    .exec(),
            ]);

            // 각 아이템에 summary 추가
            const itemsWithSummary = items.map(item => {
                const itemObj = item.toObject();
                return {
                    ...itemObj,
                    summary: this.generateSummary(item.content),
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                };
            });

            return {
                items: itemsWithSummary,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                totalItems,
            };
        } catch (error) {
            this.logger.error('고객 리뷰 목록 조회 실패:', error);
            throw new BadRequestException(
                '고객 리뷰 목록을 불러올 수 없습니다.',
            );
        }
    }

    private generateSummary(content: string): string {
        if (!content) return '';
        
        // HTML 태그 제거
        const textOnly = content.replace(/<[^>]*>/g, '');
        // 연속된 공백 및 줄바꿈 정리
        const cleaned = textOnly.replace(/\s+/g, ' ').trim();
        // 150자로 제한하고 말줄임표 추가
        return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
    }

    /**
     * 단일 고객 리뷰 조회 (공개용, 조회수 증가)
     */
    async findOneForService(id: string): Promise<CustomerReviewDocument> {
        try {
            const review = await this.customerReviewModel
                .findOne({ _id: id, isActive: true })
                .exec();

            if (!review) {
                throw new NotFoundException('고객 리뷰를 찾을 수 없습니다.');
            }

            // 조회수 증가
            await this.incrementViewCount(id);

            return review;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`고객 리뷰 조회 실패: ${id}`, error);
            throw new BadRequestException('고객 리뷰를 불러올 수 없습니다.');
        }
    }

    /**
     * 도움됨 수 증가
     */
    async incrementHelpfulCount(id: string): Promise<{ helpfulCount: number }> {
        try {
            const review = await this.customerReviewModel
                .findByIdAndUpdate(
                    id,
                    { $inc: { helpfulCount: 1 } },
                    { new: true },
                )
                .exec();

            if (!review) {
                throw new NotFoundException('고객 리뷰를 찾을 수 없습니다.');
            }

            return { helpfulCount: review.helpfulCount || 0 };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`도움됨 표시 실패: ${id}`, error);
            throw new BadRequestException('도움됨 표시에 실패했습니다.');
        }
    }

    // =================================================================
    // 내부 헬퍼 메서드들
    // =================================================================

    /**
     * 조회수 증가 (비동기적으로 처리, 실패해도 에러 안 던짐)
     */
    private async incrementViewCount(id: string): Promise<void> {
        try {
            await this.customerReviewModel
                .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
                .exec();
        } catch (error) {
            // 조회수 증가 실패는 중요하지 않으므로 로그만 남김
            this.logger.warn(`조회수 증가 실패: ${id}`, error.message);
        }
    }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService } from '../../common/file/file.service';

import {
    CustomerReview,
    CustomerReviewDocument,
} from '../../schema/customer-review.schema';

import { PaginatedResponse } from '../../common/dto/common.dto';

@Injectable()
export class AdminCustomerReviewService {
    private readonly logger = new Logger(AdminCustomerReviewService.name);

    constructor(
        @InjectModel(CustomerReview.name)
        private readonly customerReviewModel: Model<CustomerReviewDocument>,
        private readonly fileService: FileService,
    ) {}

    /**
     * 모든 고객 리뷰 목록 조회 (관리자용)
     */
    async findAllForAdmin(
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResponse<CustomerReviewDocument>> {
        try {
            const skip = (page - 1) * limit;

            const [items, totalItems] = await Promise.all([
                this.customerReviewModel
                    .find({})
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.customerReviewModel.countDocuments({}).exec(),
            ]);

            return {
                items,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                totalItems,
            };
        } catch (error) {
            this.logger.error(
                '[findAllForAdmin] 관리자 고객 리뷰 목록 조회 실패:',
                error,
            );
            throw new BadRequestException(
                '[findAllForAdmin] 고객 리뷰 목록을 불러올 수 없습니다.',
            );
        }
    }

    /**
     * 단일 고객 리뷰 조회 (관리자용)
     */
    async findOneForAdmin(id: string): Promise<CustomerReviewDocument> {
        try {
            const review = await this.customerReviewModel.findById(id).exec();

            if (!review) {
                throw new BadRequestException('고객 리뷰를 찾을 수 없습니다.');
            }

            return review;
        } catch (error) {
            this.logger.error(
                `[findOneForAdmin] 관리자 고객 리뷰 조회 실패: ${id}`,
                error,
            );

            throw new BadRequestException('고객 리뷰를 불러올 수 없습니다.');
        }
    }

    /**
     * 고객 리뷰 생성 (관리자용)
     */
    async createReview(createData: any): Promise<CustomerReviewDocument> {
        try {
            const review = new this.customerReviewModel(createData);
            return await review.save();
        } catch (error) {
            this.logger.error('[createReview] 고객 리뷰 생성 실패:', error);
            throw new BadRequestException('고객 리뷰 생성에 실패했습니다.');
        }
    }

    /**
     * 고객 리뷰 수정 (관리자용)
     */
    async updateReview(
        id: string,
        updateData: any,
    ): Promise<CustomerReviewDocument> {
        try {
            const review = await this.customerReviewModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();

            if (!review) {
                throw new BadRequestException('고객 리뷰를 찾을 수 없습니다.');
            }

            return review;
        } catch (error) {
            this.logger.error(
                `[updateReview] 고객 리뷰 수정 실패: ${id}`,
                error,
            );
            throw new BadRequestException('고객 리뷰 수정에 실패했습니다.');
        }
    }

    /**
     * 고객 리뷰 삭제 (관리자용)
     */
    async removeReview(id: string): Promise<void> {
        try {
            const result = await this.customerReviewModel
                .findByIdAndDelete(id)
                .exec();

            if (!result) {
                throw new BadRequestException('고객 리뷰를 찾을 수 없습니다.');
            }
        } catch (error) {
            this.logger.error(
                `[removeReview] 고객 리뷰 삭제 실패: ${id}`,
                error,
            );
            throw new BadRequestException('고객 리뷰 삭제에 실패했습니다.');
        }
    }

    /**
     * 고객 리뷰 활성화/비활성화 토글 (관리자용)
     */
    async toggleActive(id: string): Promise<CustomerReviewDocument> {
        try {
            const review = await this.customerReviewModel.findById(id).exec();

            if (!review) {
                throw new BadRequestException('고객 리뷰를 찾을 수 없습니다.');
            }

            review.isActive = !review.isActive;
            return await review.save();
        } catch (error) {
            this.logger.error(
                `[toggleActive] 고객 리뷰 활성화 토글 실패: ${id}`,
                error,
            );
            throw new BadRequestException(
                '고객 리뷰 상태 변경에 실패했습니다.',
            );
        }
    }

    /**
     * 이미지 업로드 (관리자용)
     */
    async uploadImages(
        files: Express.Multer.File[],
    ): Promise<{ imageUrls: string[] }> {
        try {
            const uploadPromises = files.map((file) =>
                this.fileService.uploadFile(file, 'customer-reviews', {
                    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
                    maxSize: 5 * 1024 * 1024, // 5MB
                    compressImage: true,
                    imageOptions: {
                        quality: 80,
                        width: 1200,
                    },
                }),
            );

            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map((result) => result.url);

            return { imageUrls };
        } catch (error) {
            this.logger.error('[uploadImages] 이미지 업로드 실패:', error);
            throw new BadRequestException('이미지 업로드에 실패했습니다.');
        }
    }
}

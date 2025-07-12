import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CustomerReview,
  CustomerReviewDocument,
} from '../../schema/customer-review.schema';

@Injectable()
export class CustomerReviewService {
  constructor(
    @InjectModel(CustomerReview.name)
    private customerReviewModel: Model<CustomerReviewDocument>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: CustomerReview[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const [data, total] = await Promise.all([
        this.customerReviewModel
          .find({ isActive: true })
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.customerReviewModel.countDocuments({ isActive: true }).exec(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '고객 후기 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  async findOne(id: string): Promise<CustomerReview> {
    try {
      const review = await this.customerReviewModel.findOne({ _id: id, isActive: true }).exec();
      if (!review) {
        throw new NotFoundException(`Customer review with ID "${id}" not found`);
      }

      // 조회수 증가
      await this.incrementViewCount(id);

      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // TODO: Add logger
      throw new InternalServerErrorException(
        `고객 후기를 가져오는 중 오류가 발생했습니다: ${id}`,
      );
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.customerReviewModel
        .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
        .exec();
    } catch (error) {
      // 조회수 증가 실패는 중요하지 않으므로 에러를 던지지 않음
      console.error(`조회수 증가 실패: ${id}`, error);
    }
  }

  async incrementHelpfulCount(id: string): Promise<{ helpfulCount: number }> {
    try {
      const review = await this.customerReviewModel
        .findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true })
        .exec();

      if (!review) {
        throw new NotFoundException(`고객 후기를 찾을 수 없습니다: ${id}`);
      }

      return { helpfulCount: review.helpfulCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `도움됨 표시 중 오류가 발생했습니다: ${id}`,
      );
    }
  }
}

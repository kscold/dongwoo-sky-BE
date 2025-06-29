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

  async findAll(page: number, limit: number): Promise<CustomerReview[]> {
    try {
      return this.customerReviewModel
        .find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '고객 후기 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  async findOne(id: string): Promise<CustomerReview> {
    try {
      const review = await this.customerReviewModel.findById(id).exec();
      if (!review) {
        throw new NotFoundException(`Customer review with ID "${id}" not found`);
      }
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
}

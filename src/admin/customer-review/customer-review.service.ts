import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerReviewDto } from './dto/create-customer-review.dto';
import { UpdateCustomerReviewDto } from './dto/update-customer-review.dto';
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

  async create(createCustomerReviewDto: CreateCustomerReviewDto): Promise<CustomerReview> {
    try {
      const customerReview = new this.customerReviewModel(createCustomerReviewDto);
      return await customerReview.save();
    } catch (error) {
      throw new InternalServerErrorException(
        '고객 리뷰 생성 중 오류가 발생했습니다.',
      );
    }
  }

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
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.customerReviewModel.countDocuments().exec(),
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
      throw new InternalServerErrorException(
        '고객 리뷰 목록을 가져오는 중 오류가 발생했습니다.',
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
      throw new InternalServerErrorException(
        `고객 리뷰를 가져오는 중 오류가 발생했습니다: ${id}`,
      );
    }
  }

  async update(id: string, updateCustomerReviewDto: UpdateCustomerReviewDto): Promise<CustomerReview> {
    try {
      const review = await this.customerReviewModel
        .findByIdAndUpdate(id, updateCustomerReviewDto, { new: true })
        .exec();
      
      if (!review) {
        throw new NotFoundException(`Customer review with ID "${id}" not found`);
      }
      
      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `고객 리뷰 업데이트 중 오류가 발생했습니다: ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.customerReviewModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Customer review with ID "${id}" not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `고객 리뷰 삭제 중 오류가 발생했습니다: ${id}`,
      );
    }
  }

  async toggleActive(id: string): Promise<CustomerReview> {
    try {
      const review = await this.customerReviewModel.findById(id).exec();
      if (!review) {
        throw new NotFoundException(`Customer review with ID "${id}" not found`);
      }

      review.isActive = !review.isActive;
      return await review.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `고객 리뷰 활성화 토글 중 오류가 발생했습니다: ${id}`,
      );
    }
  }

  async uploadImages(files: Express.Multer.File[]): Promise<{ imageUrls: string[] }> {
    try {
      const uploadDir = path.join(process.cwd(), 'uploads', 'customer-reviews');
      
      // 업로드 디렉토리 생성
      await fs.mkdir(uploadDir, { recursive: true });

      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const fileExtension = extname(file.originalname);
          const filename = `${uuidv4()}${fileExtension}`;
          const filepath = path.join(uploadDir, filename);
          
          await fs.writeFile(filepath, file.buffer);
          
          return `/uploads/customer-reviews/${filename}`;
        })
      );

      return { imageUrls };
    } catch (error) {
      throw new InternalServerErrorException(
        '고객 리뷰 이미지 업로드 중 오류가 발생했습니다.',
      );
    }
  }
}
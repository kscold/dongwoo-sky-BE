import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from './base-crud.service';
import { FileService } from '../file/file.service';
import {
  CustomerReview,
  CustomerReviewDocument,
} from '../../schema/customer-review.schema';
import { CreateCustomerReviewDto } from '../../admin/customer-review/dto/create-customer-review.dto';
import { UpdateCustomerReviewDto } from '../../admin/customer-review/dto/update-customer-review.dto';
import { PaginatedResponse } from '../dto/common.dto';
import { ALLOWED_IMAGE_EXTENSIONS, FILE_SIZE_LIMITS, IMAGE_COMPRESSION_OPTIONS, UPLOAD_FOLDERS } from '../constants/file.constants';
import { SORT_FIELDS, SORT_ORDER } from '../constants/pagination.constants';

/**
 * CustomerReview 통합 서비스 클래스
 * Admin과 Service 모듈에서 공통으로 사용
 */
@Injectable()
export class CustomerReviewService extends BaseCrudService<CustomerReviewDocument> {
  constructor(
    @InjectModel(CustomerReview.name)
    customerReviewModel: Model<CustomerReviewDocument>,
    private readonly fileService: FileService,
  ) {
    super(customerReviewModel);
  }

  protected getEntityName(): string {
    return '고객 리뷰';
  }

  /**
   * Admin용 전체 조회 (모든 리뷰 포함)
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @returns 페이지네이션된 결과
   */
  async findAllForAdmin(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<CustomerReviewDocument>> {
    return this.findAll(page, limit, {}, { [SORT_FIELDS.CREATED_AT]: SORT_ORDER.DESC });
  }

  /**
   * Service용 전체 조회 (활성화된 리뷰만)
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @returns 페이지네이션된 결과
   */
  async findAllForService(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<CustomerReviewDocument>> {
    return this.findAll(page, limit, { isActive: true }, { [SORT_FIELDS.PUBLISHED_AT]: SORT_ORDER.DESC });
  }

  /**
   * Admin용 단일 조회 (모든 리뷰 포함)
   * @param id 리뷰 ID
   * @returns 조회된 리뷰
   */
  async findOneForAdmin(id: string): Promise<CustomerReviewDocument> {
    return this.findOne(id);
  }

  /**
   * Service용 단일 조회 (활성화된 리뷰만, 조회수 증가)
   * @param id 리뷰 ID
   * @returns 조회된 리뷰
   */
  async findOneForService(id: string): Promise<CustomerReviewDocument> {
    const review = await this.findOne(id, { isActive: true });
    
    // 조회수 증가
    await this.incrementViewCount(id);
    
    return review;
  }

  /**
   * 고객 리뷰 생성
   * @param createCustomerReviewDto 생성 DTO
   * @returns 생성된 리뷰
   */
  async createReview(createCustomerReviewDto: CreateCustomerReviewDto): Promise<CustomerReviewDocument> {
    return this.create(createCustomerReviewDto);
  }

  /**
   * 고객 리뷰 업데이트
   * @param id 리뷰 ID
   * @param updateCustomerReviewDto 업데이트 DTO
   * @returns 업데이트된 리뷰
   */
  async updateReview(id: string, updateCustomerReviewDto: UpdateCustomerReviewDto): Promise<CustomerReviewDocument> {
    return this.update(id, updateCustomerReviewDto);
  }

  /**
   * 고객 리뷰 삭제
   * @param id 리뷰 ID
   */
  async removeReview(id: string): Promise<void> {
    return this.remove(id);
  }

  /**
   * 이미지 업로드 (FileService 사용)
   * @param files 업로드할 파일들
   * @returns 업로드된 이미지 URL들
   */
  async uploadImages(files: Express.Multer.File[]): Promise<{ imageUrls: string[] }> {
    try {
      const uploadPromises = files.map(file =>
        this.fileService.uploadFile(file, UPLOAD_FOLDERS.CUSTOMER_REVIEWS, {
          allowedExtensions: [...ALLOWED_IMAGE_EXTENSIONS],
          maxSize: FILE_SIZE_LIMITS.IMAGE,
          compressImage: true,
          imageOptions: {
            quality: IMAGE_COMPRESSION_OPTIONS.QUALITY,
            width: 1200,
          },
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map(result => result.url);

      return { imageUrls };
    } catch (error) {
      this.logger.error(`이미지 업로드 중 오류: ${error.message}`, error.stack);
      throw error;
    }
  }
}
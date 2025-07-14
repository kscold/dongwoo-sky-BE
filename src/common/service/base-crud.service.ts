import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginatedResponse } from '../dto/common.dto';
import { ExceptionUtil } from '../utils/exception.util';
import { SORT_ORDER, SORT_FIELDS } from '../constants/pagination.constants';

/**
 * 기본 CRUD 기능을 제공하는 추상 클래스
 * 모든 엔티티 서비스에서 상속하여 사용
 */
@Injectable()
export abstract class BaseCrudService<T extends Document> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly model: Model<T>) {}

  /**
   * 엔티티 생성
   * @param createDto 생성 DTO
   * @returns 생성된 엔티티
   */
  async create(createDto: any): Promise<T> {
    try {
      const entity = new this.model(createDto);
      return await entity.save();
    } catch (error) {
      throw ExceptionUtil.entityCreateFailed(this.getEntityName(), error);
    }
  }

  /**
   * 페이지네이션을 지원하는 전체 조회
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @param filter 필터 조건
   * @param sort 정렬 조건
   * @returns 페이지네이션된 결과
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filter: any = {},
    sort: any = { [SORT_FIELDS.CREATED_AT]: SORT_ORDER.DESC },
  ): Promise<PaginatedResponse<T>> {
    try {
      const skip = (page - 1) * limit;

      const [items, totalItems] = await Promise.all([
        this.model
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filter).exec(),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        items,
        totalPages,
        currentPage: page,
        totalItems,
      };
    } catch (error) {
      throw ExceptionUtil.entityListFailed(this.getEntityName(), error);
    }
  }

  /**
   * 단일 엔티티 조회
   * @param id 엔티티 ID
   * @param filter 추가 필터 조건
   * @returns 조회된 엔티티
   */
  async findOne(id: string, filter: any = {}): Promise<T> {
    try {
      const query = { _id: id, ...filter };
      const entity = await this.model.findOne(query).exec();
      
      if (!entity) {
        throw ExceptionUtil.entityNotFound(this.getEntityName(), id);
      }
      
      return entity;
    } catch (error) {
      // NotFoundException은 그대로 전파
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ExceptionUtil.internalServerError(
        `${this.getEntityName()}를 가져오는 중 오류가 발생했습니다: ${id}`,
        error
      );
    }
  }

  /**
   * 엔티티 업데이트
   * @param id 엔티티 ID
   * @param updateDto 업데이트 DTO
   * @returns 업데이트된 엔티티
   */
  async update(id: string, updateDto: any): Promise<T> {
    try {
      const entity = await this.model
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();

      if (!entity) {
        throw ExceptionUtil.entityNotFound(this.getEntityName(), id);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ExceptionUtil.entityUpdateFailed(this.getEntityName(), id, error);
    }
  }

  /**
   * 엔티티 삭제
   * @param id 엔티티 ID
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      if (!result) {
        throw ExceptionUtil.entityNotFound(this.getEntityName(), id);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ExceptionUtil.entityDeleteFailed(this.getEntityName(), id, error);
    }
  }

  /**
   * 엔티티 활성화/비활성화 토글
   * @param id 엔티티 ID
   * @returns 업데이트된 엔티티
   */
  async toggleActive(id: string): Promise<T> {
    try {
      const entity = await this.model.findById(id).exec();
      if (!entity) {
        throw ExceptionUtil.entityNotFound(this.getEntityName(), id);
      }

      // isActive 필드가 있는 경우에만 토글
      if ('isActive' in entity) {
        (entity as any).isActive = !(entity as any).isActive;
        return await entity.save();
      } else {
        throw ExceptionUtil.internalServerError(
          `${this.getEntityName()}는 활성화 토글을 지원하지 않습니다.`,
        );
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw ExceptionUtil.entityToggleFailed(this.getEntityName(), id, error);
    }
  }

  /**
   * 조회수 증가
   * @param id 엔티티 ID
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.model
        .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
        .exec();
    } catch (error) {
      // 조회수 증가 실패는 중요하지 않으므로 에러를 던지지 않음
      this.logger.warn(`조회수 증가 실패: ${id}`, error.message);
    }
  }

  /**
   * 도움됨 수 증가
   * @param id 엔티티 ID
   * @returns 업데이트된 도움됨 수
   */
  async incrementHelpfulCount(id: string): Promise<{ helpfulCount: number }> {
    try {
      const entity = await this.model
        .findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true })
        .exec();

      if (!entity) {
        throw ExceptionUtil.entityNotFound(this.getEntityName(), id);
      }

      return { helpfulCount: (entity as any).helpfulCount || 0 };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw ExceptionUtil.internalServerError(
        `도움됨 표시 중 오류가 발생했습니다: ${id}`,
        error
      );
    }
  }

  /**
   * 엔티티 이름을 반환하는 추상 메서드
   * 각 서비스에서 구현해야 함
   */
  protected abstract getEntityName(): string;
}
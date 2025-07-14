import { IsOptional, IsBoolean, IsDate, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * 기본 엔티티 DTO - 모든 엔티티에서 공통으로 사용되는 필드들
 */
export class BaseEntityDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  updatedAt?: Date;
}

/**
 * 활성화 가능한 엔티티 DTO
 */
export class ActivatableEntityDto extends BaseEntityDto {
  @IsOptional()
  @IsBoolean({ message: '활성화 상태는 boolean 값이어야 합니다.' })
  isActive?: boolean = true;
}

/**
 * 공개 가능한 엔티티 DTO
 */
export class PublishableEntityDto extends BaseEntityDto {
  @IsOptional()
  @IsBoolean({ message: '공개 상태는 boolean 값이어야 합니다.' })
  isPublished?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  publishedAt?: Date;
}

/**
 * 정렬 가능한 엔티티 DTO
 */
export class SortableEntityDto extends BaseEntityDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  sortOrder?: number = 0;
}
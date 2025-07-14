import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';

/**
 * 기본 페이지네이션 요청 DTO
 */
export class BasePaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: '페이지는 정수여야 합니다.' })
  @Min(1, { message: '페이지는 1 이상이어야 합니다.' })
  page?: number = PAGINATION_DEFAULTS.PAGE;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: '페이지당 항목 수는 정수여야 합니다.' })
  @Min(1, { message: '페이지당 항목 수는 1 이상이어야 합니다.' })
  @Max(PAGINATION_DEFAULTS.MAX_LIMIT, { 
    message: `페이지당 항목 수는 ${PAGINATION_DEFAULTS.MAX_LIMIT} 이하여야 합니다.` 
  })
  limit?: number = PAGINATION_DEFAULTS.LIMIT;
}
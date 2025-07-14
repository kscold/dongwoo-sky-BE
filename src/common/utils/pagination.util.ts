import { PaginatedResponse, LegacyPaginatedResponse } from '../dto/common.dto';

/**
 * 페이지네이션 관련 유틸리티 함수들
 */
export class PaginationUtil {
  /**
   * PaginatedResponse를 LegacyPaginatedResponse로 변환
   * 기존 컨트롤러와의 호환성을 위해 사용
   * @param paginatedResponse 새로운 형식의 페이지네이션 응답
   * @returns 레거시 형식의 페이지네이션 응답
   */
  static toLegacyFormat<T>(paginatedResponse: PaginatedResponse<T>): LegacyPaginatedResponse<T> {
    return {
      data: paginatedResponse.items,
      total: paginatedResponse.totalItems,
      page: paginatedResponse.currentPage,
      limit: Math.ceil(paginatedResponse.totalItems / paginatedResponse.totalPages) || 10,
      totalPages: paginatedResponse.totalPages,
    };
  }

  /**
   * LegacyPaginatedResponse를 PaginatedResponse로 변환
   * @param legacyResponse 레거시 형식의 페이지네이션 응답
   * @returns 새로운 형식의 페이지네이션 응답
   */
  static fromLegacyFormat<T>(legacyResponse: LegacyPaginatedResponse<T>): PaginatedResponse<T> {
    return {
      items: legacyResponse.data,
      totalItems: legacyResponse.total,
      currentPage: legacyResponse.page,
      totalPages: legacyResponse.totalPages,
    };
  }

  /**
   * 페이지네이션 파라미터 검증 및 기본값 설정
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   * @returns 검증된 페이지네이션 파라미터
   */
  static validatePaginationParams(
    page: string | number = 1,
    limit: string | number = 10
  ): { page: number; limit: number } {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    return {
      page: Math.max(1, isNaN(pageNumber) ? 1 : pageNumber),
      limit: Math.min(100, Math.max(1, isNaN(limitNumber) ? 10 : limitNumber)),
    };
  }
}
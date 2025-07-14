/**
 * API 요청 관련 DTO
 */

// 페이지네이션 쿼리 파라미터
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 검색 쿼리 파라미터
export interface SearchQuery extends PaginationQuery {
  keyword?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
}

// 필터 쿼리 파라미터
export interface FilterQuery extends PaginationQuery {
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  isPublished?: boolean;
  isApproved?: boolean;
}
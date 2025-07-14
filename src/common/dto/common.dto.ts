/**
 * 공통 DTO 타입 정의
 */

// 기본 엔티티 타입
export interface BaseEntity {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 페이지네이션 관련 타입
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// 레거시 페이지네이션 응답 (기존 컨트롤러와의 호환성)
export interface LegacyPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  error?: string;
}

// 정렬 관련 타입
export interface SortableEntity {
  sortOrder: number;
}

// 활성화/비활성화 관련 타입
export interface ActivatableEntity {
  isActive: boolean;
}

// 공개/비공개 관련 타입
export interface PublishableEntity {
  isPublished: boolean;
}

// 승인 관련 타입
export interface ApprovableEntity {
  isApproved: boolean;
}
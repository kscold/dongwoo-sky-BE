/**
 * 페이지네이션 관련 상수들
 */

// 기본 페이지네이션 설정
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// 정렬 순서
export const SORT_ORDER = {
  ASC: 1,
  DESC: -1,
} as const;

// 일반적인 정렬 필드
export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  PUBLISHED_AT: 'publishedAt',
  SORT_ORDER: 'sortOrder',
  NAME: 'name',
  TITLE: 'title',
} as const;
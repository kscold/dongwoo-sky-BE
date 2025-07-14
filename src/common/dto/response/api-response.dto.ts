/**
 * API 응답 관련 DTO
 */

import { ApiResponse } from '../common.dto';

// 기존 ApiResponseDto 클래스 (NestJS 컨트롤러에서 사용)
export class ApiResponseDto<T = any> implements ApiResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
  error?: string;

  constructor(response: Partial<ApiResponse<T>>) {
    this.success = response.success ?? false;
    this.code = response.code ?? 500;
    this.message = response.message;
    this.data = response.data;
    this.error = response.error;
  }
}

// HTTP 상태 코드 enum
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// API 에러 타입
export interface ApiError {
  code: HttpStatusCode;
  message: string;
  details?: any;
  timestamp: Date;
  path: string;
}

// 성공 응답 타입
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  code: HttpStatusCode;
  data: T;
}

// 에러 응답 타입
export interface ErrorResponse extends ApiResponse {
  success: false;
  code: HttpStatusCode;
  error: string;
  message?: string;
}

// 파일 업로드 응답 타입
export interface FileUploadResponse {
  url: string;
  key: string;
  name: string;
  size: number;
  mimeType: string;
}

// 일괄 처리 응답 타입
export interface BulkOperationResponse {
  successCount: number;
  failureCount: number;
  totalCount: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// 통계 응답 타입
export interface StatsResponse {
  totalUsers: number;
  totalEquipments: number;
  totalNotices: number;
  totalWorkShowcases: number;
  totalCustomerReviews: number;
  totalContactInquiries: number;
  unreadInquiries: number;
  activeUsers: number;
  publishedEquipments: number;
  recentActivity: Array<{
    type: string;
    count: number;
    date: string;
  }>;
}

// 헬스 체크 응답 타입
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: Date;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  version: string;
}

// 공통 에러 메시지
export const ERROR_MESSAGES = {
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '리소스를 찾을 수 없습니다.',
  VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
  DUPLICATE_ERROR: '이미 존재하는 데이터입니다.',
  INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  FILE_UPLOAD_ERROR: '파일 업로드에 실패했습니다.',
  FILE_SIZE_ERROR: '파일 크기가 너무 큽니다.',
  FILE_TYPE_ERROR: '지원하지 않는 파일 형식입니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CREATED: '성공적으로 생성되었습니다.',
  UPDATED: '성공적으로 수정되었습니다.',
  DELETED: '성공적으로 삭제되었습니다.',
  FILE_UPLOADED: '파일이 성공적으로 업로드되었습니다.',
  LOGIN_SUCCESS: '로그인에 성공했습니다.',
  LOGOUT_SUCCESS: '로그아웃에 성공했습니다.',
} as const;
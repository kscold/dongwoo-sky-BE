/**
 * 인증 관련 요청 DTO
 */

// 사용자 역할 enum
export enum UserRole {
  ADMIN = 'admin',
  WORKER = 'worker',
  CUSTOMER = 'customer',
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 사용자 생성 요청 타입
export interface UserCreateRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phoneNumber?: string;
}

// 사용자 업데이트 요청 타입
export interface UserUpdateRequest {
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
}

// 사용자 승인 요청 타입
export interface UserApprovalRequest {
  userId: string;
  isApproved: boolean;
}
/**
 * 인증 관련 응답 DTO
 */

import { UserRole } from '../request/auth-request.dto';
import { SuccessResponse } from '../../../../common/dto/response/api-response.dto';

// JWT 페이로드 타입
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isApproved: boolean;
  };
}

// 인증 관련 API 응답 타입
export interface LoginApiResponse extends SuccessResponse<{
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isApproved: boolean;
  };
}> {}

export interface RefreshTokenResponse extends SuccessResponse<{
  accessToken: string;
}> {}
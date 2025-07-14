import { ApiResponseDto } from '../dto/response/api-response.dto';
import { PaginatedResponse, LegacyPaginatedResponse } from '../dto/common.dto';
import { SUCCESS_MESSAGES } from '../constants/error-messages.constants';

/**
 * 응답 포맷팅 유틸리티
 */
export class ResponseUtil {
  /**
   * 성공 응답 생성
   */
  static success<T>(data?: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.OPERATION_SUCCESS,
      data,
    });
  }

  /**
   * 생성 성공 응답
   */
  static created<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      code: 201,
      message: message || SUCCESS_MESSAGES.CREATED,
      data,
    });
  }

  /**
   * 업데이트 성공 응답
   */
  static updated<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.UPDATED,
      data,
    });
  }

  /**
   * 삭제 성공 응답
   */
  static deleted(message?: string): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.DELETED,
      data: null,
    });
  }

  /**
   * 업로드 성공 응답
   */
  static uploaded<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.UPLOADED,
      data,
    });
  }

  /**
   * 페이지네이션 응답 생성 (새로운 형식)
   */
  static paginated<T>(
    paginatedData: PaginatedResponse<T>,
    message?: string,
  ): ApiResponseDto<PaginatedResponse<T>> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.OPERATION_SUCCESS,
      data: paginatedData,
    });
  }

  /**
   * 레거시 페이지네이션 응답 생성 (기존 호환성)
   */
  static legacyPaginated<T>(
    legacyData: LegacyPaginatedResponse<T>,
    message?: string,
  ): ApiResponseDto<LegacyPaginatedResponse<T>> {
    return new ApiResponseDto({
      success: true,
      code: 200,
      message: message || SUCCESS_MESSAGES.OPERATION_SUCCESS,
      data: legacyData,
    });
  }

  /**
   * 에러 응답 생성
   */
  static error(
    code: number = 500,
    message: string = '서버 오류가 발생했습니다.',
    error?: string,
  ): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      code,
      message,
      data: null,
      error,
    });
  }

  /**
   * 검증 실패 응답
   */
  static validationError(
    errors: string[] | string,
    message: string = '유효성 검사에 실패했습니다.',
  ): ApiResponseDto<null> {
    const errorMessage = Array.isArray(errors) ? errors.join(', ') : errors;
    return new ApiResponseDto({
      success: false,
      code: 400,
      message,
      data: null,
      error: errorMessage,
    });
  }

  /**
   * 인증 실패 응답
   */
  static unauthorized(message: string = '인증이 필요합니다.'): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      code: 401,
      message,
      data: null,
      error: 'Unauthorized',
    });
  }

  /**
   * 권한 없음 응답
   */
  static forbidden(message: string = '권한이 없습니다.'): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      code: 403,
      message,
      data: null,
      error: 'Forbidden',
    });
  }

  /**
   * 리소스를 찾을 수 없음 응답
   */
  static notFound(message: string = '요청한 리소스를 찾을 수 없습니다.'): ApiResponseDto<null> {
    return new ApiResponseDto({
      success: false,
      code: 404,
      message,
      data: null,
      error: 'Not Found',
    });
  }
}
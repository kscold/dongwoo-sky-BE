import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

/**
 * 공통 예외 처리 유틸리티
 */
export class ExceptionUtil {
  private static readonly logger = new Logger('ExceptionUtil');

  /**
   * 엔티티를 찾을 수 없을 때 발생하는 예외
   */
  static entityNotFound(entityName: string, id: string): NotFoundException {
    return new NotFoundException(ERROR_MESSAGES.ENTITY_NOT_FOUND(entityName, id));
  }

  /**
   * 엔티티 생성 실패 예외
   */
  static entityCreateFailed(entityName: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error(`${entityName} 생성 실패:`, error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.ENTITY_CREATE_FAILED(entityName));
  }

  /**
   * 엔티티 업데이트 실패 예외
   */
  static entityUpdateFailed(entityName: string, id: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error(`${entityName} 업데이트 실패 (ID: ${id}):`, error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.ENTITY_UPDATE_FAILED(entityName, id));
  }

  /**
   * 엔티티 삭제 실패 예외
   */
  static entityDeleteFailed(entityName: string, id: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error(`${entityName} 삭제 실패 (ID: ${id}):`, error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.ENTITY_DELETE_FAILED(entityName, id));
  }

  /**
   * 엔티티 목록 조회 실패 예외
   */
  static entityListFailed(entityName: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error(`${entityName} 목록 조회 실패:`, error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.ENTITY_LIST_FAILED(entityName));
  }

  /**
   * 엔티티 활성화 토글 실패 예외
   */
  static entityToggleFailed(entityName: string, id: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error(`${entityName} 활성화 토글 실패 (ID: ${id}):`, error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.ENTITY_TOGGLE_FAILED(entityName, id));
  }

  /**
   * 파일 업로드 실패 예외
   */
  static fileUploadFailed(error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error('파일 업로드 실패:', error);
    }
    return new InternalServerErrorException(ERROR_MESSAGES.FILE_UPLOAD_FAILED);
  }

  /**
   * 잘못된 파일 형식 예외
   */
  static invalidFileExtension(allowedExtensions: string[]): BadRequestException {
    return new BadRequestException(ERROR_MESSAGES.FILE_INVALID_EXTENSION(allowedExtensions));
  }

  /**
   * 파일 크기 초과 예외
   */
  static fileSizeExceeded(maxSize: number): BadRequestException {
    return new BadRequestException(ERROR_MESSAGES.FILE_SIZE_EXCEEDED(maxSize));
  }

  /**
   * 인증 실패 예외
   */
  static unauthorized(message?: string): UnauthorizedException {
    return new UnauthorizedException(message || ERROR_MESSAGES.UNAUTHORIZED);
  }

  /**
   * 권한 없음 예외
   */
  static forbidden(message?: string): ForbiddenException {
    return new ForbiddenException(message || ERROR_MESSAGES.FORBIDDEN);
  }

  /**
   * 잘못된 요청 예외
   */
  static badRequest(message?: string): BadRequestException {
    return new BadRequestException(message || ERROR_MESSAGES.BAD_REQUEST);
  }

  /**
   * 필수 필드 누락 예외
   */
  static requiredFieldMissing(fieldName: string): BadRequestException {
    return new BadRequestException(ERROR_MESSAGES.REQUIRED_FIELD_MISSING(fieldName));
  }

  /**
   * 일반적인 내부 서버 오류 예외
   */
  static internalServerError(message?: string, error?: any): InternalServerErrorException {
    if (error) {
      this.logger.error('내부 서버 오류:', error);
    }
    return new InternalServerErrorException(message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  /**
   * 에러 로깅 및 재발생
   * 기존 에러가 NestJS 예외인 경우 그대로 발생, 아닌 경우 InternalServerErrorException으로 래핑
   */
  static handleError(error: any, defaultMessage?: string): never {
    // NestJS의 HTTP Exception인 경우 그대로 발생
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }

    // 그 외의 경우 로깅 후 InternalServerErrorException으로 래핑
    this.logger.error('처리되지 않은 오류:', error);
    throw new InternalServerErrorException(defaultMessage || ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
}
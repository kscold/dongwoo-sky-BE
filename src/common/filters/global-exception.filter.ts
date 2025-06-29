import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/response/api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Bad request';
    let error = exception;

    // 인증 오류만 401, 나머지는 400으로 통일
    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message || 'Unauthorized';
    } else if (exception instanceof HttpException) {
      // 401만 예외, 나머지는 400
      if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message || 'Unauthorized';
      } else {
        status = HttpStatus.BAD_REQUEST;
        const res = exception.getResponse();
        if (typeof res === 'string') {
          message = res;
        } else if (typeof res === 'object' && res !== null) {
          message = (res as any).message || message;
          error = (res as any).error || error;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const apiResponse = new ApiResponseDto({
      success: false,
      code: status,
      error: message,
    });

    response.status(status).json(apiResponse);
  }
}

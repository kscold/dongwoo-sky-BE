import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/response/api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let code: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        error = (exceptionResponse as any).error || exception.name;
        message = (exceptionResponse as any).message || exception.message;
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      } else {
        error = exception.name;
        message = exceptionResponse as string;
      }
    } else {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '서버 내부 오류가 발생했습니다.';
      error = 'Internal Server Error';
    }

    const errorResponse = new ApiResponseDto({
      success: false,
      code,
      message,
      error,
    });

    this.logger.error(
      `[${request.method} ${request.url}] HTTP Status: ${code} Error Message: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(code).json(errorResponse);
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponseDto } from '../dto/response/api-response.dto';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // 이미 ApiResponseDto 형태면 그대로 반환
        if (data instanceof ApiResponseDto) return data;
        return new ApiResponseDto({
          success: true,
          code: 200,
          message: '성공',
          data,
        });
      }),
      catchError((err) => {
        // NestJS HttpException 등에서 status, message 추출
        const code = err?.status || 500;
        const message = err?.message || '서버 오류';
        return throwError(
          () =>
            new ApiResponseDto({
              success: false,
              code,
              message,
              error: err?.response?.error || err?.response || message,
            }),
        );
      }),
    );
  }
}

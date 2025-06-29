import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class ApiResponseDto<T = any> {
  @IsBoolean()
  @Expose()
  success: boolean;

  @IsInt()
  @Expose()
  code: number;

  @IsString()
  @IsOptional()
  @Expose()
  message?: string;

  @IsOptional()
  @Expose()
  data?: T;

  @IsString()
  @IsOptional()
  @Expose()
  error?: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

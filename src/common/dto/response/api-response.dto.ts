import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true })
  @IsBoolean()
  @Expose()
  success: boolean;

  @ApiProperty({ example: 200 })
  @IsInt()
  @Expose()
  code: number;

  @ApiProperty({ example: '성공', required: false })
  @IsString()
  @IsOptional()
  @Expose()
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  data?: T;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Expose()
  error?: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class AdminNoticeCreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isModal?: boolean;

  @IsOptional()
  @IsDateString()
  modalEndDate?: Date;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
} 
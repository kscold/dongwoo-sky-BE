import {
  IsString,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  introduction: string;

  @IsArray()
  @IsString({ each: true })
  careers: string[];

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

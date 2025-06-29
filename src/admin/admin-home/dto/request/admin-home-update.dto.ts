import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdminHomeCreateHeroTitleDto } from './admin-home-create-hero-title.dto';
import { AdminHomeCreateHeroButtonsDto } from './admin-home-create-hero-buttons.dto';

export class AdminHomeUpdateDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AdminHomeCreateHeroTitleDto)
  heroTitle?: AdminHomeCreateHeroTitleDto;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  heroImages?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AdminHomeCreateHeroButtonsDto)
  heroButtons?: AdminHomeCreateHeroButtonsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

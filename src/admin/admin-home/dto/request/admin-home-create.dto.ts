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

export class AdminHomeCreateDto {
  @IsString()
  pageId: string;

  @ValidateNested()
  @Type(() => AdminHomeCreateHeroTitleDto)
  heroTitle: AdminHomeCreateHeroTitleDto;

  @IsString()
  heroSubtitle: string;

  @IsArray()
  @IsString({ each: true })
  heroImages: string[];

  @ValidateNested()
  @Type(() => AdminHomeCreateHeroButtonsDto)
  heroButtons: AdminHomeCreateHeroButtonsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

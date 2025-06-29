import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class HeroTitleDto {
  @IsString()
  preTitle: string;

  @IsString()
  mainTitle: string;

  @IsString()
  postTitle: string;
}

class HeroButtonsDto {
  @IsString()
  primaryButtonText: string;

  @IsString()
  primaryButtonLink: string;

  @IsString()
  secondaryButtonText: string;

  @IsString()
  secondaryButtonLink: string;
}

export class CreateLandingPageDto {
  @IsString()
  pageId: string;

  @ValidateNested()
  @Type(() => HeroTitleDto)
  heroTitle: HeroTitleDto;

  @IsString()
  heroSubtitle: string;

  @IsArray()
  @IsString({ each: true })
  heroImages: string[];

  @ValidateNested()
  @Type(() => HeroButtonsDto)
  heroButtons: HeroButtonsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateLandingPageDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroTitleDto)
  heroTitle?: HeroTitleDto;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  heroImages?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => HeroButtonsDto)
  heroButtons?: HeroButtonsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

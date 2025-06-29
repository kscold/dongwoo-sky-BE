import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HeroSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ctaText: string;

  @IsString()
  @IsNotEmpty()
  ctaLink: string;
}

export class AdminHomeCreateDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => HeroSectionDto)
  @IsOptional()
  heroSection?: HeroSectionDto;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

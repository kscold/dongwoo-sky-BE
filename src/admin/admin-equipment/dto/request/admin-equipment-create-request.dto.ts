import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';

export class AdminEquipmentCreateRequestDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  capabilities?: string[];

  @IsString()
  @IsOptional()
  priceRange?: string;

  @IsString()
  @IsOptional()
  maxHeight?: string;

  @IsString()
  @IsOptional()
  maxWeight?: string;

  @IsString()
  @IsOptional()
  tonnage?: string;

  @IsString()
  @IsOptional()
  iconUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  priceRanges?: string[];

  @IsBoolean()
  @IsOptional()
  showInService?: boolean;

  @IsBoolean()
  @IsOptional()
  showInPricing?: boolean;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @IsOptional()
  baseHours?: number;

  @IsNumber()
  @IsOptional()
  minHours?: number;

  @IsNumber()
  @IsOptional()
  maxHours?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workingTimeRanges?: string[];
}

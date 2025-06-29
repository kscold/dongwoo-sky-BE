import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';

export class AdminEquipmentCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @IsString()
  tonnage?: string;

  @IsOptional()
  @IsString()
  maxHeight?: string;

  @IsOptional()
  @IsString()
  maxWeight?: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  priceRanges?: string[];

  @IsOptional()
  @IsBoolean()
  showInService?: boolean;

  @IsOptional()
  @IsBoolean()
  showInPricing?: boolean;
}

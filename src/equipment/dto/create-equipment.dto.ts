import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateEquipmentDto {
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
  @IsArray()
  @IsString({ each: true })
  capabilities?: string[];

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @IsString()
  maxHeight?: string;

  @IsOptional()
  @IsString()
  maxWeight?: string;

  @IsOptional()
  @IsString()
  tonnage?: string;
}

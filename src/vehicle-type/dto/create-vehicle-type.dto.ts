import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateVehicleTypeDto {
  @IsString()
  name: string;

  @IsEnum(['ladder', 'sky'])
  type: 'ladder' | 'sky';

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  priceRanges?: string[];

  @IsOptional()
  @IsString()
  specifications?: string;
}

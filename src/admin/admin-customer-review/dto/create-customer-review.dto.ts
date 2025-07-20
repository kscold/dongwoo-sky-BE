import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerCompany?: string;

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
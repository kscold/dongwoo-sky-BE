import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  ArrayMaxSize,
} from 'class-validator';

export class CreateWorkShowcaseDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: '이미지는 최대 10개까지 업로드 가능합니다.' })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  authorName: string;

  @IsString()
  @IsOptional()
  authorRole?: string;

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsString()
  @IsOptional()
  equipmentUsed?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateWorkShowcaseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: '이미지는 최대 10개까지 업로드 가능합니다.' })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  authorName?: string;

  @IsString()
  @IsOptional()
  authorRole?: string;

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsString()
  @IsOptional()
  equipmentUsed?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateCustomerReviewDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: '이미지는 최대 10개까지 업로드 가능합니다.' })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
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
  @Min(1, { message: '평점은 최소 1점입니다.' })
  @Max(5, { message: '평점은 최대 5점입니다.' })
  rating: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCustomerReviewDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: '이미지는 최대 10개까지 업로드 가능합니다.' })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  customerName?: string;

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
  @Min(1, { message: '평점은 최소 1점입니다.' })
  @Max(5, { message: '평점은 최대 5점입니다.' })
  @IsOptional()
  rating?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional, Min, Max, IsUrl } from 'class-validator';

export class CreateSitemapConfigDto {
  @IsString()
  @IsUrl({}, { message: 'URL 형식이 올바르지 않습니다.' })
  url: string;

  @IsEnum(['static', 'dynamic'], { message: '타입은 static 또는 dynamic이어야 합니다.' })
  type: 'static' | 'dynamic';

  @IsNumber({}, { message: 'Priority는 숫자여야 합니다.' })
  @Min(0.0, { message: 'Priority는 0.0 이상이어야 합니다.' })
  @Max(1.0, { message: 'Priority는 1.0 이하여야 합니다.' })
  priority: number;

  @IsEnum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'], {
    message: 'changefreq는 올바른 값이어야 합니다.'
  })
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

  @IsOptional()
  @IsBoolean({ message: 'isActive는 boolean 값이어야 합니다.' })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber({}, { message: 'sortOrder는 숫자여야 합니다.' })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean({ message: 'includeInSitemap는 boolean 값이어야 합니다.' })
  includeInSitemap?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'allowRobots는 boolean 값이어야 합니다.' })
  allowRobots?: boolean;
}
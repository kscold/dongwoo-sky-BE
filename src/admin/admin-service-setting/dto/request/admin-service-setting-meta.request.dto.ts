import { IsOptional, IsString } from 'class-validator';

export class AdminServiceSettingMetaRequestDto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;
}

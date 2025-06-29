import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { AdminServiceSettingMetaRequestDto } from './admin-service-setting-meta.request.dto';

export class AdminServiceSettingCreateRequestDto extends AdminServiceSettingMetaRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsString()
  icon?: string;
}

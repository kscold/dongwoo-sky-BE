import { PartialType } from '@nestjs/mapped-types';
import { AdminServiceSettingCreateRequestDto } from './admin-service-setting-create.request.dto';

export class AdminServiceSettingUpdateRequestDto extends PartialType(
  AdminServiceSettingCreateRequestDto,
) {}

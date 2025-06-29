import { PartialType } from '@nestjs/mapped-types';
import { AdminEquipmentCreateDto } from './admin-equipment-create.dto';

export class AdminEquipmentUpdateDto extends PartialType(
  AdminEquipmentCreateDto,
) {}

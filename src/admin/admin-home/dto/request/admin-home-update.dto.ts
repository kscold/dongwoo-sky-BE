import { PartialType } from '@nestjs/mapped-types';
import { AdminHomeCreateDto } from './admin-home-create.dto';

export class AdminHomeUpdateDto extends PartialType(AdminHomeCreateDto) {}

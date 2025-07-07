import { PartialType } from '@nestjs/mapped-types';
import { AdminWorkShowcaseCreateRequestDto } from './admin-work-showcase-create-request.dto';

export class AdminWorkShowcaseUpdateRequestDto extends PartialType(AdminWorkShowcaseCreateRequestDto) { } 
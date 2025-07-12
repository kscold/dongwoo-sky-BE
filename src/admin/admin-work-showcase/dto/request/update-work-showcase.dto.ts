import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkShowcaseDto } from './create-work-showcase.dto';

export class UpdateWorkShowcaseDto extends PartialType(CreateWorkShowcaseDto) { } 
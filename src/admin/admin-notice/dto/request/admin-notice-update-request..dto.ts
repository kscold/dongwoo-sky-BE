import { PartialType } from '@nestjs/mapped-types';
import { AdminNoticeCreateRequestDto } from './admin-notice-create-request.dto';

export class AdminNoticeUpdateRequestDto extends PartialType(AdminNoticeCreateRequestDto) {} 
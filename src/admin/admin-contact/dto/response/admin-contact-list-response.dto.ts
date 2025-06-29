import { AdminContactResponseDto } from './admin-contact-response.dto';

export class AdminContactListResponseDto {
  contacts: AdminContactResponseDto[];
  total: number;
}

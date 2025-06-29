import { IsString } from 'class-validator';

export class AdminApproveUserRequestDto {
  @IsString()
  userId: string;
}

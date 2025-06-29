import { IsString } from 'class-validator';

export class AdminApproveUserDto {
  @IsString()
  userId: string;
}

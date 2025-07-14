import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginRequest } from './auth-request.dto';

export class AdminUserLoginRequestDto implements LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

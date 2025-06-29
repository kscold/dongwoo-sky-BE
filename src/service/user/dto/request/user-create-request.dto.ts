import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';
import { UserRole } from '../../../../schema/user.schema';

export class UserCreateRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsIn([UserRole.WORKER, UserRole.CUSTOMER])
  role: UserRole;
}

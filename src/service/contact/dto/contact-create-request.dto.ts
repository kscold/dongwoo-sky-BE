import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactCreateRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

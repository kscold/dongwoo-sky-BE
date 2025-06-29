import { IsString, IsArray, IsOptional } from 'class-validator';

export class AdminProfileUpdateDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  introduction: string;

  @IsArray()
  @IsString({ each: true })
  careers: string[];

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  profileImage?: string;
}

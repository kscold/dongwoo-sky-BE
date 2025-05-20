import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNoticeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSiteSettingDto {
  @IsString()
  @IsOptional()
  contactPhoneNumber?: string;

  @IsUrl({}, { message: '유효한 URL 형식이 아닙니다.' })
  @IsOptional()
  kakaoOpenChatUrl?: string;
}

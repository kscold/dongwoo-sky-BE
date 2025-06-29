import { IsString } from 'class-validator';

export class AdminHomeCreateHeroTitleDto {
  @IsString()
  preTitle: string;

  @IsString()
  mainTitle: string;

  @IsString()
  postTitle: string;
}

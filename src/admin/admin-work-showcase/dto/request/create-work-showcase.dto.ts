import { IsString, IsOptional, IsArray, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateWorkShowcaseDto {
    @IsString()
    @MinLength(1, { message: '제목은 1자 이상이어야 합니다.' })
    @MaxLength(200, { message: '제목은 200자 이하여야 합니다.' })
    title: string;

    @IsString()
    @MinLength(1, { message: '내용은 1자 이상이어야 합니다.' })
    content: string;

    @IsString()
    @MinLength(1, { message: '작업자 이름은 1자 이상이어야 합니다.' })
    @MaxLength(50, { message: '작업자 이름은 50자 이하여야 합니다.' })
    authorName: string;

    @IsOptional()
    @IsString()
    @MaxLength(100, { message: '작업자 역할은 100자 이하여야 합니다.' })
    authorRole?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200, { message: '프로젝트 위치는 200자 이하여야 합니다.' })
    projectLocation?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200, { message: '사용 장비는 200자 이하여야 합니다.' })
    equipmentUsed?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
} 
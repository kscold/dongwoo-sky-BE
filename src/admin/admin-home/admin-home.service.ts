import {
    Injectable,
    BadRequestException,
    Logger,
    HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService } from '../../common/file/file.service';

import { Home, HomeDocument } from '../../schema/home.schema';

import { ApiResponseDto } from '../../common/dto/response/api-response.dto';
import { AdminHomeResponseDto } from './dto/response/admin-home.response.dto';

@Injectable()
export class AdminHomeService {
    private readonly logger = new Logger(AdminHomeService.name);

    constructor(
        @InjectModel(Home.name)
        private homeModel: Model<HomeDocument>,
        private fileService: FileService,
    ) {}

    // 메인 홈 데이터 조회 (Public API)
    async getMainHomeData(): Promise<ApiResponseDto<Home>> {
        try {
            const mainHome = await this.homeModel
                .findOne({ key: 'main' })
                .lean()
                .exec();

            if (!mainHome) {
                throw new BadRequestException('홈 데이터가 없습니다.');
            }

            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: mainHome,
            });
        } catch (error) {
            this.logger.error(
                `[getMainHomeData] 메인 홈 데이터 조회 실패: ${error.message}`,
            );
            throw new BadRequestException(
                `[getMainHomeData] 메인 홈 데이터 조회 실패: ${error.message}`,
            );
        }
    }

    // 어드민 - 단일 홈 설정 조회
    async fetchHomeSettings(): Promise<ApiResponseDto<AdminHomeResponseDto>> {
        try {
            const home = await this.homeModel
                .findOne({ key: 'main' })
                .lean()
                .exec();

            if (!home) {
                throw new BadRequestException('홈 설정 데이터가 없습니다.');
            }

            // 직접 응답 데이터 생성 (plainToInstance 사용하지 않음)
            const ctaButtons = home.heroSection?.ctaButtons || [];
            const responseData: AdminHomeResponseDto = {
                _id: home._id?.toString(),
                pageId: home.key,
                heroTitle: {
                    preTitle: home.heroSection?.title || '',
                    mainTitle: home.heroSection?.subtitle || '',
                    postTitle: home.heroSection?.description || '',
                },
                heroSubtitle: '',
                heroImages: (home.heroSection?.backgroundImageUrls || []).map(
                    (img: any) => img.url,
                ),
                heroButtons: {
                    primaryButtonText: ctaButtons[0]?.text || '',
                    primaryButtonLink: ctaButtons[0]?.link || '',
                    secondaryButtonText: ctaButtons[1]?.text || '',
                    secondaryButtonLink: ctaButtons[1]?.link || '',
                },
                contentSettings: (home as any).contentSettings || [],
                isActive: home.isActive,
                sortOrder: (home as any).sortOrder ?? 0,
            };

            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: responseData,
            });
        } catch (error) {
            this.logger.error(
                `[fetchHomeSettings] 홈 조회 실패: ${error.message}`,
            );
            throw new BadRequestException(
                `[fetchHomeSettings] 홈 조회 실패: ${error.message}`,
            );
        }
    }

    // 어드민 - 홈 설정 업데이트 (생성 또는 수정)
    async upsertHomeSettings(
        updateHomeDto: any,
    ): Promise<ApiResponseDto<AdminHomeResponseDto>> {
        try {
            this.logger.log(
                '[upsertHomeSettings] 업데이트 요청 데이터:',
                updateHomeDto,
            );

            // 프론트엔드 데이터를 백엔드 스키마에 맞게 변환
            const transformedData = {
                key: 'main', // 항상 단일 main 홈 설정
                title: updateHomeDto.heroTitle?.mainTitle || '홈 설정',
                description: '홈페이지 설정입니다.',
                heroSection: {
                    title: updateHomeDto.heroTitle?.preTitle || '',
                    companyName:
                        updateHomeDto.heroSection?.companyName ||
                        '어울림 스카이',
                    highlightText:
                        updateHomeDto.heroSection?.highlightText ||
                        '어울림 스카이',
                    subtitle: updateHomeDto.heroTitle?.mainTitle || '',
                    description: updateHomeDto.heroTitle?.postTitle || '',
                    ctaButtons: [
                        {
                            text:
                                updateHomeDto.heroButtons?.primaryButtonText ||
                                '',
                            link:
                                updateHomeDto.heroButtons?.primaryButtonLink ||
                                '',
                        },
                        {
                            text:
                                updateHomeDto.heroButtons
                                    ?.secondaryButtonText || '',
                            link:
                                updateHomeDto.heroButtons
                                    ?.secondaryButtonLink || '',
                        },
                    ],
                    backgroundImageUrls: (updateHomeDto.heroImages || []).map(
                        (url: any) =>
                            typeof url === 'string' ? { url, alt: '' } : url,
                    ),
                    isActive: true,
                },
                contentSettings: updateHomeDto.contentSettings || [],
                isActive: updateHomeDto.isActive !== false,
            };

            this.logger.log(
                '[upsertHomeSettings] 변환된 데이터:',
                transformedData,
            );

            // 기존 홈 설정 찾기 (key가 'main'인 것)
            let home = await this.homeModel.findOne({ key: 'main' });

            if (home) {
                // 기존 설정 업데이트
                home = await this.homeModel
                    .findByIdAndUpdate(home._id, transformedData, { new: true })
                    .exec();
                this.logger.log(
                    '[upsertHomeSettings] 업데이트된 데이터:',
                    home,
                );
            } else {
                // 새로운 설정 생성
                home = new this.homeModel(transformedData);
                home = await home.save();
                this.logger.log('[upsertHomeSettings] 생성된 데이터:', home);
            }

            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: this.mapHomeToResponseDto(home),
            });
        } catch (error) {
            this.logger.error('[upsertHomeSettings] 실패:', error);
            throw new BadRequestException(
                `[upsertHomeSettings] 홈 설정 저장 실패: ${error.message}`,
            );
        }
    }

    // 히어로 이미지 업로드 (다중)
    async uploadHeroImages(
        files: Express.Multer.File[],
    ): Promise<ApiResponseDto<{ images: any[] }>> {
        try {
            // 공통 파일 업로드 로직 사용 (FileService)
            const heroImages = await this.fileService.uploadImagesAsHeroImages(
                files,
                'home/hero-images',
            );

            // 단순히 업로드된 이미지 정보만 반환 (DB 저장은 별도 저장 API에서 처리)
            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: { images: heroImages },
            });
        } catch (error) {
            this.logger.error(
                `[uploadHeroImages] 히어로 이미지 업로드 실패: ${error.message}`,
            );
            throw new BadRequestException(
                `[uploadHeroImages] 히어로 이미지 업로드 실패: ${error.message}`,
            );
        }
    }

    // 업로드된 히어로 이미지들 조회
    async getHeroImages(): Promise<{ images: string[] }> {
        // mainPage는 ApiResponseDto<Home> 타입이므로 .data로 접근해야 함
        const mainPageRes = await this.getMainHomeData();
        const mainPage = mainPageRes.data;
        let images: string[] = [];
        if (
            mainPage &&
            mainPage.heroSection &&
            Array.isArray(mainPage.heroSection.backgroundImageUrls)
        ) {
            images = mainPage.heroSection.backgroundImageUrls.map(
                (img) => img.url,
            );
        }
        return { images };
    }

    // 히어로 이미지 삭제
    async deleteHeroImage(
        imageUrl: string,
    ): Promise<ApiResponseDto<{ message: string }>> {
        try {
            const mainPageRes = await this.getMainHomeData();
            const mainPage = mainPageRes.data;
            if (!mainPage)
                throw new BadRequestException(
                    '메인 홈 데이터를 찾을 수 없습니다.',
                );
            const heroImages = mainPage.heroSection.backgroundImageUrls || [];
            // 삭제 대상 HeroImage 찾기
            const updatedImages = heroImages.filter(
                (img) => img.url !== imageUrl,
            );

            const updateData = {
                'heroSection.backgroundImageUrls': updatedImages,
            };
            await this.homeModel
                .findByIdAndUpdate((mainPage as any)._id, updateData, {
                    new: true,
                })
                .exec();
            // S3에서 파일 삭제 (옵션)
            try {
                if (
                    imageUrl.includes('cloudfront.net') ||
                    imageUrl.includes('amazonaws.com')
                ) {
                    const matches = imageUrl.match(/home\/hero-images\/[^?]+/);
                    if (matches) {
                        const key = matches[0];
                        await this.fileService.deleteFile(key);
                    }
                }
            } catch (s3Error) {
                // 무시
            }
            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: { message: '이미지가 성공적으로 삭제되었습니다.' },
            });
        } catch (error) {
            this.logger.error(
                `[deleteHeroImage] 히어로 이미지 삭제 실패: ${error.message}`,
            );
            throw new BadRequestException(
                `[deleteHeroImage] 히어로 이미지 삭제 실패: ${error.message}`,
            );
        }
    }

    private mapHomeToResponseDto(home: HomeDocument): AdminHomeResponseDto {
        const ctaButtons = home.heroSection?.ctaButtons || [];
        const responseData = {
            _id: home._id?.toString(),
            pageId: home.key,
            heroTitle: {
                preTitle: home.heroSection?.title || '',
                mainTitle: home.heroSection?.subtitle || '',
                postTitle: home.heroSection?.description || '',
            },
            heroSubtitle: '', // 이 필드는 더 이상 사용되지 않음
            heroImages: (home.heroSection?.backgroundImageUrls || []).map(
                (img) => img.url,
            ),
            heroButtons: {
                primaryButtonText: ctaButtons[0]?.text || '',
                primaryButtonLink: ctaButtons[0]?.link || '',
                secondaryButtonText: ctaButtons[1]?.text || '',
                secondaryButtonLink: ctaButtons[1]?.link || '',
            },
            contentSettings: (home as any).contentSettings || [],
            isActive: home.isActive,
            sortOrder: (home as any).sortOrder ?? 0,
        };

        return plainToInstance(AdminHomeResponseDto, responseData);
    }
}

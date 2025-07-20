import {
    BadRequestException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    ServiceGuide,
    ServiceGuideDocument,
} from '../../schema/service-guide.schema';

import { UpdateServiceGuideDto } from './dto/update-service-guide.dto';
import { ApiResponseDto } from 'src/common/dto/response/api-response.dto';
import { FileService } from '../../common/file/file.service';

const SERVICE_GUIDE_KEY = 'main_service_guide';

@Injectable()
export class AdminServiceGuideService {
    private readonly logger = new Logger(AdminServiceGuideService.name);

    constructor(
        @InjectModel(ServiceGuide.name)
        private readonly serviceGuideModel: Model<ServiceGuideDocument>,
        private readonly fileService: FileService,
    ) {}

    async findOrCreateServiceGuide(): Promise<ServiceGuideDocument> {
        try {
            let serviceGuide = await this.serviceGuideModel
                .findOne({ key: SERVICE_GUIDE_KEY })
                .exec();

            if (!serviceGuide) {
                throw new BadRequestException(
                    '[findOrCreateServiceGuide] 서비스 가이드 데이터가 없습니다.',
                );
            }

            return serviceGuide;
        } catch (error) {
            this.logger.error(
                `[findOrCreateServiceGuide] 서비스 가이드 데이터 조회 실패: ${error.message}`,
            );
            throw new BadRequestException(
                `[findOrCreateServiceGuide] 서비스 가이드 데이터 조회 실패: ${error.message}`,
            );
        }
    }

    async updateServiceGuide(
        updateDto: UpdateServiceGuideDto,
    ): Promise<ServiceGuideDocument> {
        const updated = await this.serviceGuideModel
            .findOneAndUpdate(
                { key: SERVICE_GUIDE_KEY },
                { $set: updateDto },
                {
                    new: true,
                    upsert: true,
                },
            )
            .exec();

        if (!updated) {
            throw new BadRequestException('Service guide data not found.');
        }
        return updated;
    }

    async uploadProfileImage(
        file: Express.Multer.File,
    ): Promise<ApiResponseDto<{ imageUrl: string }>> {
        try {
            this.logger.log(
                `[uploadProfileImage] 프로필 이미지 업로드 시작: ${file?.originalname}`,
            );

            if (!file) {
                throw new BadRequestException('업로드할 파일이 없습니다.');
            }

            const heroImage = await this.fileService.uploadImageAsHeroImage(
                file,
                'service-guide/profile',
                0,
            );

            const serviceGuide = await this.serviceGuideModel
                .findOne({ key: SERVICE_GUIDE_KEY })
                .exec();

            if (serviceGuide) {
                await this.serviceGuideModel
                    .findByIdAndUpdate(
                        serviceGuide._id,
                        {
                            $set: {
                                'profile.imageUrl': heroImage.url,
                            },
                        },
                        { new: true },
                    )
                    .exec();

                this.logger.log(
                    `[uploadProfileImage] DB 업데이트 완료: ${heroImage.url}`,
                );
            } else {
                throw new BadRequestException(
                    '서비스 가이드 데이터를 찾을 수 없습니다.',
                );
            }

            this.logger.log(
                `[uploadProfileImage] 프로필 이미지 업로드 성공: ${file.originalname}`,
            );

            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: { imageUrl: heroImage.url },
            });
        } catch (error) {
            this.logger.error(
                `[uploadProfileImage] 프로필 이미지 업로드 실패: ${file?.originalname}`,
                error.stack,
            );
            throw new BadRequestException(
                `프로필 이미지 업로드 실패: ${error.message}`,
            );
        }
    }

    async deleteProfileImage(
        imageUrl: string,
    ): Promise<ApiResponseDto<{ message: string }>> {
        try {
            this.logger.log(
                `[deleteProfileImage] 프로필 이미지 삭제 시작: ${imageUrl}`,
            );

            const serviceGuide = await this.serviceGuideModel
                .findOne({ key: SERVICE_GUIDE_KEY })
                .exec();

            if (serviceGuide) {
                await this.serviceGuideModel
                    .findByIdAndUpdate(
                        serviceGuide._id,
                        {
                            $set: {
                                'profile.imageUrl': '',
                            },
                        },
                        { new: true },
                    )
                    .exec();

                this.logger.log(
                    `[deleteProfileImage] DB에서 이미지 URL 제거 완료`,
                );
            }

            if (
                imageUrl.includes('cloudfront.net') ||
                imageUrl.includes('amazonaws.com')
            ) {
                const matches = imageUrl.match(/service-guide\/profile\/[^?]+/);
                if (matches) {
                    const key = matches[0];
                    await this.fileService.deleteFile(key);
                    this.logger.log(
                        `[deleteProfileImage] S3에서 파일 삭제 완료: ${key}`,
                    );
                }
            }

            this.logger.log(
                `[deleteProfileImage] 프로필 이미지 삭제 성공: ${imageUrl}`,
            );

            return new ApiResponseDto({
                success: true,
                code: HttpStatus.OK,
                data: { message: '프로필 이미지가 삭제되었습니다.' },
            });
        } catch (error) {
            this.logger.error(
                `[deleteProfileImage] 프로필 이미지 삭제 실패: ${imageUrl}`,
                error.stack,
            );
            throw new BadRequestException(
                `프로필 이미지 삭제 실패: ${error.message}`,
            );
        }
    }
}

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    WorkShowcase,
    WorkShowcaseDocument,
} from '../../schema/work-showcase.schema';
import { AdminWorkShowcaseCreateRequestDto } from './dto/request/admin-work-showcase-create-request.dto';
import { AdminWorkShowcaseUpdateRequestDto } from './dto/request/admin-work-showcase-update-request.dto.dto';
import { PaginatedWorkShowcases } from './dto/response/admin-work-showcase-list-response.dto';

@Injectable()
export class AdminWorkShowcaseService {
    constructor(
        @InjectModel(WorkShowcase.name)
        private workShowcaseModel: Model<WorkShowcaseDocument>,
    ) { }

    async create(createWorkShowcaseDto: AdminWorkShowcaseCreateRequestDto): Promise<WorkShowcaseDocument> {
        try {
            const workShowcase = new this.workShowcaseModel({
                ...createWorkShowcaseDto,
                isActive: createWorkShowcaseDto.isPublished ?? true,
                publishedAt: createWorkShowcaseDto.isPublished !== false ? new Date() : null,
            });
            return await workShowcase.save();
        } catch (error) {
            throw new InternalServerErrorException(
                '작업자 자랑거리 생성 중 오류가 발생했습니다.',
            );
        }
    }

    async findAll(page: number = 1, limit: number = 10): Promise<PaginatedWorkShowcases> {
        try {
            const skip = (page - 1) * limit;

            const [items, totalItems] = await Promise.all([
                this.workShowcaseModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.workShowcaseModel.countDocuments().exec(),
            ]);

            const totalPages = Math.ceil(totalItems / limit);

            return {
                items,
                totalPages,
                currentPage: page,
                totalItems,
            };
        } catch (error) {
            throw new InternalServerErrorException(
                '작업자 자랑거리 목록을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async findOne(id: string): Promise<WorkShowcaseDocument> {
        try {
            const workShowcase = await this.workShowcaseModel.findById(id).exec();
            if (!workShowcase) {
                throw new NotFoundException(`작업자 자랑거리를 찾을 수 없습니다: ${id}`);
            }
            return workShowcase;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `작업자 자랑거리를 가져오는 중 오류가 발생했습니다: ${id}`,
            );
        }
    }

    async update(id: string, updateWorkShowcaseDto: AdminWorkShowcaseUpdateRequestDto): Promise<WorkShowcaseDocument> {
        try {
            const updateData: any = { ...updateWorkShowcaseDto };

            // isPublished 상태에 따라 isActive와 publishedAt 업데이트
            if (updateWorkShowcaseDto.isPublished !== undefined) {
                updateData.isActive = updateWorkShowcaseDto.isPublished;
                updateData.publishedAt = updateWorkShowcaseDto.isPublished ? new Date() : null;
            }

            const workShowcase = await this.workShowcaseModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();

            if (!workShowcase) {
                throw new NotFoundException(`작업자 자랑거리를 찾을 수 없습니다: ${id}`);
            }

            return workShowcase;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `작업자 자랑거리 수정 중 오류가 발생했습니다: ${id}`,
            );
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.workShowcaseModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new NotFoundException(`작업자 자랑거리를 찾을 수 없습니다: ${id}`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `작업자 자랑거리 삭제 중 오류가 발생했습니다: ${id}`,
            );
        }
    }

    async incrementViewCount(id: string): Promise<void> {
        try {
            await this.workShowcaseModel
                .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
                .exec();
        } catch (error) {
            // 조회수 증가 실패는 중요하지 않으므로 에러를 던지지 않음
            console.error(`조회수 증가 실패: ${id}`, error);
        }
    }

    async incrementLikeCount(id: string): Promise<WorkShowcaseDocument> {
        try {
            const workShowcase = await this.workShowcaseModel
                .findByIdAndUpdate(id, { $inc: { likeCount: 1 } }, { new: true })
                .exec();

            if (!workShowcase) {
                throw new NotFoundException(`작업자 자랑거리를 찾을 수 없습니다: ${id}`);
            }

            return workShowcase;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `좋아요 증가 중 오류가 발생했습니다: ${id}`,
            );
        }
    }
} 
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from '../../common/file/file.service';

import { Notice, NoticeDocument } from '../../schema/notice.schema';

import { AdminNoticeCreateRequestDto } from './dto/request/admin-notice-create-request.dto';
import { AdminNoticeUpdateRequestDto } from './dto/request/admin-notice-update-request.dto';
import { AdminNoticeResponseDto } from './dto/response/admin-notice.response.dto';

@Injectable()
export class AdminNoticeService {
    private readonly logger = new Logger(AdminNoticeService.name);

    constructor(
        @InjectModel(Notice.name)
        private noticeModel: Model<NoticeDocument>,
        private readonly fileService: FileService,
    ) {}

    async create(
        createNoticeDto: AdminNoticeCreateRequestDto,
    ): Promise<AdminNoticeResponseDto> {
        try {
            const notice = new this.noticeModel(createNoticeDto);
            const saved = await notice.save();
            this.logger.log(`공지사항 생성 성공: ${createNoticeDto.title}`);
            return this.toResponseDto(saved);
        } catch (e) {
            this.logger.error(
                `공지사항 생성 실패: ${createNoticeDto.title}`,
                e.stack,
            );
            throw new BadRequestException(e.message);
        }
    }

    async findAll(
        page: number,
        limit: number,
    ): Promise<{ data: AdminNoticeResponseDto[]; total: number }> {
        try {
            this.logger.log(
                `공지사항 목록 조회 요청: page=${page}, limit=${limit}`,
            );
            const [notices, total] = await Promise.all([
                this.noticeModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean()
                    .exec(),
                this.noticeModel.countDocuments(),
            ]);
            return {
                data: notices.map((notice) => this.toResponseDto(notice)),
                total,
            };
        } catch (e) {
            this.logger.error(`공지사항 목록 조회 실패: ${e.message}`, e.stack);
            throw new BadRequestException(e.message);
        }
    }

    async findOne(id: string): Promise<AdminNoticeResponseDto> {
        this.logger.log(`공지사항 상세 조회 요청: ${id}`);
        const notice = await this.noticeModel.findById(id).lean().exec();
        if (!notice) {
            throw new BadRequestException('공지사항을 찾을 수 없습니다.');
        }
        this.logger.log(`공지사항 상세 조회 성공: ${id}`);
        return this.toResponseDto(notice);
    }

    async update(
        id: string,
        updateNoticeDto: AdminNoticeUpdateRequestDto,
    ): Promise<AdminNoticeResponseDto> {
        this.logger.log(`공지사항 수정 요청: ${id}`);
        const notice = await this.noticeModel
            .findByIdAndUpdate(id, updateNoticeDto, { new: true })
            .lean()
            .exec();
        if (!notice) {
            throw new BadRequestException('공지사항을 찾을 수 없습니다.');
        }
        this.logger.log(`공지사항 수정 성공: ${id}`);
        return this.toResponseDto(notice);
    }

    async remove(id: string): Promise<void> {
        try {
            this.logger.log(`[remove] 공지사항 삭제 요청: ${id}`);

            const result = await this.noticeModel.findByIdAndDelete(id).exec();

            if (!result) {
                throw new BadRequestException('공지사항을 찾을 수 없습니다.');
            }

            this.logger.log(`[remove] 공지사항 삭제 성공: ${id}`);
        } catch (e) {
            this.logger.error(`[remove] 공지사항 삭제 실패: ${id}`, e.stack);
            throw new BadRequestException(e.message);
        }
    }

    private toResponseDto(notice: any): AdminNoticeResponseDto {
        return {
            _id: notice._id?.toString() || notice._id,
            title: notice.title || '',
            content: notice.content || '',
            isPublished: notice.isPublished ?? false,
            isModal: notice.isModal ?? false,
            modalEndDate: notice.modalEndDate,
            author: notice.author || '관리자',
            tags: notice.tags || [],
            attachments: notice.attachments || [],
            createdAt: notice.createdAt,
            updatedAt: notice.updatedAt,
        };
    }

    async uploadAttachments(files: Express.Multer.File[]): Promise<{
        attachments: { url: string; key: string; name: string }[];
    }> {
        try {
            this.logger.log(`[uploadAttachments] 파일 업로드 시작: ${files.length}개`);

            if (!files || files.length === 0) {
                throw new BadRequestException('업로드할 파일이 없습니다.');
            }

            const uploadPromises = files.map(async (file) => {
                const uploadResult = await this.fileService.uploadFile(
                    file,
                    'notice/attachments',
                    {
                        allowedExtensions: [
                            '.jpg', '.jpeg', '.png', '.gif', '.webp',
                            '.pdf', '.doc', '.docx', '.xls', '.xlsx',
                            '.txt', '.hwp'
                        ],
                        maxSize: 15 * 1024 * 1024, // 15MB
                    }
                );

                return {
                    url: uploadResult.url,
                    key: uploadResult.key,
                    name: file.originalname,
                };
            });

            const attachments = await Promise.all(uploadPromises);

            this.logger.log(`[uploadAttachments] 파일 업로드 성공: ${attachments.length}개`);

            return { attachments };
        } catch (error) {
            this.logger.error(`[uploadAttachments] 파일 업로드 실패:`, error.stack);
            throw new BadRequestException(`파일 업로드 실패: ${error.message}`);
        }
    }
}

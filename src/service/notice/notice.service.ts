import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notice, NoticeDocument } from '../../schema/notice.schema';

import { NoticeResponseDto } from './dto/notice.response.dto';

@Injectable()
export class NoticeService {
    private readonly logger = new Logger(NoticeService.name);

    constructor(
        @InjectModel(Notice.name) private noticeModel: Model<NoticeDocument>,
    ) {}

    private toResponseDto(notice: NoticeDocument): NoticeResponseDto {
        // content에서 HTML 태그 제거하고 첫 150자로 요약 생성
        const summary = this.generateSummary(notice.content);
        
        return {
            _id: notice._id.toString(),
            title: notice.title,
            content: notice.content,
            summary,
            isPublished: notice.isPublished,
            isModal: notice.isModal,
            modalEndDate: notice.modalEndDate,
            author: notice.author,
            tags: notice.tags,
            attachments: notice.attachments || [],
            createdAt: (notice as any).createdAt,
            updatedAt: (notice as any).updatedAt,
        };
    }

    private generateSummary(content: string): string {
        if (!content) return '';
        
        // HTML 태그 제거
        const textOnly = content.replace(/<[^>]*>/g, '');
        // 연속된 공백 및 줄바꿈 정리
        const cleaned = textOnly.replace(/\s+/g, ' ').trim();
        // 150자로 제한하고 말줄임표 추가
        return cleaned.length > 150 ? cleaned.substring(0, 150) + '...' : cleaned;
    }

    async getModalNotice(): Promise<NoticeResponseDto | null> {
        try {
            const notice = await this.noticeModel.findOne({
                isModal: true,
                isPublished: true,
            });
            return notice ? this.toResponseDto(notice) : null;
        } catch (error) {
            this.logger.error(
                `모달 공지사항을 가져오는 중 오류가 발생했습니다. ${error.message}`,
                error.stack,
            );
            throw new BadRequestException(
                '모달 공지사항을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async getPublishedNotices(): Promise<NoticeResponseDto[]> {
        try {
            this.logger.log(
                '[getPublishedNotices] 게시된 공지사항 목록 조회 시작',
            );
            const notices = await this.noticeModel
                .find({
                    isPublished: true,
                })
                .sort({ createdAt: -1 })
                .exec();
            this.logger.log(
                `[getPublishedNotices] 게시된 공지사항 ${notices.length}개 조회 성공`,
            );
            return notices.map(notice => this.toResponseDto(notice));
        } catch (error) {
            this.logger.error(
                '[getPublishedNotices] 게시된 공지사항 조회 실패',
                error.stack,
            );
            throw new BadRequestException(
                '게시된 공지사항을 조회하는 중 오류가 발생했습니다.',
            );
        }
    }

    async getPublishedNoticesWithPagination(
        page: number,
        limit: number,
    ): Promise<{
        data: NoticeResponseDto[];
        total: number;
    }> {
        try {
            this.logger.log(
                `[getPublishedNoticesWithPagination] 페이지네이션 공지사항 조회 시작 - page: ${page}, limit: ${limit}`,
            );

            const skip = (page - 1) * limit;

            const [notices, total] = await Promise.all([
                this.noticeModel
                    .find({
                        isPublished: true,
                        isModal: { $ne: true }, // 모달 공지사항 제외
                    })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.noticeModel.countDocuments({
                    isPublished: true,
                    isModal: { $ne: true },
                }),
            ]);

            this.logger.log(
                `[getPublishedNoticesWithPagination] 공지사항 조회 성공 - 총 ${total}개 중 ${notices.length}개 조회`,
            );

            return {
                data: notices.map(notice => this.toResponseDto(notice)),
                total,
            };
        } catch (error) {
            this.logger.error(
                '[getPublishedNoticesWithPagination] 페이지네이션 공지사항 조회 실패',
                error.stack,
            );
            throw new BadRequestException(
                '공지사항을 조회하는 중 오류가 발생했습니다.',
            );
        }
    }

    async getPublishedNoticeById(
        id: string,
    ): Promise<NoticeResponseDto | null> {
        try {
            this.logger.log(
                `[getPublishedNoticeById] 공지사항 상세 조회 시작 - ID: ${id}`,
            );

            const notice = await this.noticeModel.findOne({
                _id: id,
                isPublished: true,
            });

            if (!notice) {
                this.logger.warn(
                    `[getPublishedNoticeById] 공지사항을 찾을 수 없음 - ID: ${id}`,
                );
                return null;
            }

            this.logger.log(
                `[getPublishedNoticeById] 공지사항 상세 조회 성공 - ID: ${id}`,
            );
            return this.toResponseDto(notice);
        } catch (error) {
            this.logger.error(
                `[getPublishedNoticeById] 공지사항 상세 조회 실패 - ID: ${id}`,
                error.stack,
            );
            throw new BadRequestException(
                '공지사항을 조회하는 중 오류가 발생했습니다.',
            );
        }
    }
}

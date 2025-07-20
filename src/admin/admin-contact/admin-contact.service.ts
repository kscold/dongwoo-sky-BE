import {
    BadRequestException,
    Injectable,
    Logger,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact, ContactDocument } from '../../schema/contact.schema';
import {
    ContactSetting,
    ContactSettingDocument,
} from '../../schema/contact-setting.schema';
import {
    ContactInquiry,
    ContactInquiryDocument,
} from '../../schema/contact-inquiry.schema';

import { AdminContactListResponseDto } from './dto/response/admin-contact-list-response.dto';
import { UpdateContactSettingsDto } from '../../service/contact/dto/update-contact-settings.dto';

@Injectable()
export class AdminContactService {
    private readonly logger = new Logger(AdminContactService.name);

    constructor(
        @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
        @InjectModel(ContactSetting.name)
        private contactSettingModel: Model<ContactSettingDocument>,
        @InjectModel(ContactInquiry.name)
        private contactInquiryModel: Model<ContactInquiryDocument>,
    ) {}

    async getContactList(): Promise<AdminContactListResponseDto> {
        try {
            const contactDocs = await this.contactModel
                .find()
                .sort({ createdAt: -1 })
                .exec();
            const total = await this.contactModel.countDocuments().exec();
            const contacts = contactDocs.map((contact) => ({
                _id: (contact._id as any).toHexString(),
                name: contact.name,
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                message: contact.message,
                isRead: contact.isRead,
                createdAt: contact.createdAt,
            }));
            return { contacts, total };
        } catch (error) {
            this.logger.error(
                `[getContactList] 연락처 목록 조회 실패: ${error}`,
            );
            throw new BadRequestException(`연락처 목록 조회 실패: ${error}`);
        }
    }

    async markAsRead(id: string): Promise<{ success: boolean }> {
        try {
            await this.contactModel.findByIdAndUpdate(id, { isRead: true });
            return { success: true };
        } catch (error) {
            this.logger.error(`[markAsRead] 연락처 읽음 처리 실패: ${error}`);
            throw new BadRequestException(`연락처 읽음 처리 실패: ${error}`);
        }
    }

    async getContactSettings(): Promise<ContactSetting> {
        try {
            let contactSetting = await this.contactSettingModel
                .findOne({ isActive: true })
                .exec();

            // 기본 설정이 없으면 생성
            if (!contactSetting) {
                try {
                    contactSetting = await this.contactSettingModel.create({
                        pageTitle: '문의하기',
                        pageSubtitle:
                            '궁금한 점이 있으시면 언제든지 연락해 주세요',
                        pageDescription:
                            '전문 상담사가 친절하게 답변해 드리겠습니다. 24시간 내에 답변을 받아보실 수 있습니다.',
                        contactSectionTitle: '연락처 정보',
                        contactSectionDescription:
                            '다양한 방법으로 연락하실 수 있습니다',
                        businessName: '동우스카이 건설장비',
                        businessAddress:
                            '서울특별시 강남구 테헤란로 123, 456호',
                        businessPhone: '02-1234-5678',
                        businessEmail: 'contact@dongwoosky.com',
                        businessFax: '02-1234-5679',
                        operatingHours: '평일 09:00 - 18:00',
                        businessDays: [
                            '월요일',
                            '화요일',
                            '수요일',
                            '목요일',
                            '금요일',
                        ],
                        kakaoTalkId: 'dongwoosky',
                        formTitle: '온라인 문의',
                        formDescription:
                            '아래 양식을 작성해 주시면 빠른 시간 내에 연락드리겠습니다.',
                        inquiryTypes: [
                            '장비 대여 문의',
                            '가격 문의',
                            '기술 지원',
                            '사업 제안',
                            '기타 문의',
                        ],
                        submitButtonText: '문의 보내기',
                        successMessage:
                            '문의가 성공적으로 전송되었습니다. 빠른 시간 내에 연락드리겠습니다.',
                        errorMessage:
                            '문의 전송 중 오류가 발생했습니다. 다시 시도해 주세요.',
                        privacyNotes: [
                            '개인정보는 문의 처리 목적으로만 사용됩니다.',
                            '수집된 정보는 법정 보관기간 후 안전하게 폐기됩니다.',
                            '제3자에게 개인정보를 제공하지 않습니다.',
                        ],
                        emergencyContactTitle: '긴급 연락처',
                        emergencyContactDescription:
                            '긴급한 상황 시 24시간 연락 가능',
                        emergencyPhone: '010-1234-5678',
                        emergencyHours: '24시간 연중무휴',
                        mapTitle: '오시는 길',
                        mapDescription:
                            '대중교통 이용 시 지하철 2호선 강남역 3번 출구에서 도보 10분',
                        latitude: 37.498095,
                        longitude: 127.02761,
                        discordWebhookUrl: '',
                        discordEnabled: false,
                        discordMessageTitle: '새로운 문의가 도착했습니다',
                        discordEmbedColor: '#00ff00',
                        isActive: true,
                    });
                } catch (createError) {
                    this.logger.error(
                        'Contact setting creation error:',
                        createError,
                    );
                    throw createError;
                }
            }

            return contactSetting;
        } catch (error) {
            this.logger.error(
                `[getContactSettings] 연락처 설정 조회 실패: ${error}`,
            );
            throw new InternalServerErrorException(
                '연락처 설정을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async updateContactSettings(
        updateContactSettingsDto: UpdateContactSettingsDto,
    ): Promise<ContactSetting> {
        try {
            let contactSetting = await this.contactSettingModel
                .findOne({ isActive: true })
                .exec();

            if (!contactSetting) {
                // 기본 설정이 없으면 생성
                contactSetting = await this.contactSettingModel.create({
                    pageTitle: '문의하기',
                    pageSubtitle: '궁금한 점이 있으시면 언제든지 연락해 주세요',
                    pageDescription:
                        '전문 상담사가 친절하게 답변해 드리겠습니다. 24시간 내에 답변을 받아보실 수 있습니다.',
                    contactSectionTitle: '연락처 정보',
                    contactSectionDescription:
                        '다양한 방법으로 연락하실 수 있습니다',
                    businessName: '동우스카이 건설장비',
                    businessAddress: '서울특별시 강남구 테헤란로 123, 456호',
                    businessPhone: '02-1234-5678',
                    businessEmail: 'contact@dongwoosky.com',
                    businessFax: '02-1234-5679',
                    operatingHours: '평일 09:00 - 18:00',
                    businessDays: [
                        '월요일',
                        '화요일',
                        '수요일',
                        '목요일',
                        '금요일',
                    ],
                    kakaoTalkId: 'dongwoosky',
                    formTitle: '온라인 문의',
                    formDescription:
                        '아래 양식을 작성해 주시면 빠른 시간 내에 연락드리겠습니다.',
                    inquiryTypes: [
                        '장비 대여 문의',
                        '가격 문의',
                        '기술 지원',
                        '사업 제안',
                        '기타 문의',
                    ],
                    submitButtonText: '문의 보내기',
                    successMessage:
                        '문의가 성공적으로 전송되었습니다. 빠른 시간 내에 연락드리겠습니다.',
                    errorMessage:
                        '문의 전송 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    privacyNotes: [
                        '개인정보는 문의 처리 목적으로만 사용됩니다.',
                        '수집된 정보는 법정 보관기간 후 안전하게 폐기됩니다.',
                        '제3자에게 개인정보를 제공하지 않습니다.',
                    ],
                    emergencyContactTitle: '긴급 연락처',
                    emergencyContactDescription:
                        '긴급한 상황 시 24시간 연락 가능',
                    emergencyPhone: '010-1234-5678',
                    emergencyHours: '24시간 연중무휴',
                    mapTitle: '오시는 길',
                    mapDescription:
                        '대중교통 이용 시 지하철 2호선 강남역 3번 출구에서 도보 10분',
                    latitude: 37.498095,
                    longitude: 127.02761,
                    discordWebhookUrl: '',
                    discordEnabled: false,
                    discordMessageTitle: '새로운 문의가 도착했습니다',
                    discordEmbedColor: '#00ff00',
                    isActive: true,
                });
            }

            // 설정 업데이트
            const updatedSetting = await this.contactSettingModel
                .findByIdAndUpdate(
                    contactSetting._id,
                    {
                        ...updateContactSettingsDto,
                        updatedAt: new Date(),
                    },
                    { new: true },
                )
                .exec();

            return updatedSetting;
        } catch (error) {
            this.logger.error(
                `[updateContactSettings] 연락처 설정 업데이트 실패: ${error}`,
            );
            throw new InternalServerErrorException(
                '연락처 설정 업데이트 중 오류가 발생했습니다.',
            );
        }
    }

    async getAllInquiries(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const [inquiries, total] = await Promise.all([
                this.contactInquiryModel
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.contactInquiryModel.countDocuments().exec(),
            ]);

            return {
                data: inquiries,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            this.logger.error(
                `[getAllInquiries] 문의 목록 조회 실패: ${error}`,
            );
            throw new InternalServerErrorException(
                '문의 목록을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async updateInquiryStatus(
        id: string,
        status: string,
        adminNote?: string,
        respondedBy?: string,
    ) {
        try {
            const updateData: any = {
                status,
                updatedAt: new Date(),
            };

            if (adminNote) updateData.adminNote = adminNote;
            if (respondedBy) {
                updateData.respondedBy = respondedBy;
                updateData.respondedAt = new Date();
            }

            return await this.contactInquiryModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();
        } catch (error) {
            this.logger.error(
                `[updateInquiryStatus] 문의 상태 업데이트 실패: ${error}`,
            );
            throw new InternalServerErrorException(
                '문의 상태 업데이트 중 오류가 발생했습니다.',
            );
        }
    }
}

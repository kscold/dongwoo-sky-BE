import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    ContactSetting,
    ContactSettingDocument,
} from '../../schema/contact-setting.schema';
import {
    ContactInquiry,
    ContactInquiryDocument,
} from '../../schema/contact-inquiry.schema';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import axios from 'axios';

@Injectable()
export class ContactService {
    constructor(
        @InjectModel(ContactSetting.name)
        private contactSettingModel: Model<ContactSettingDocument>,
        @InjectModel(ContactInquiry.name)
        private contactInquiryModel: Model<ContactInquiryDocument>,
    ) {}

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
                    console.error(
                        'Contact setting creation error:',
                        createError,
                    );
                    throw createError;
                }
            }

            return contactSetting;
        } catch (error) {
            throw new InternalServerErrorException(
                '연락처 설정을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async createContactInquiry(
        createContactInquiryDto: CreateContactInquiryDto,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<ContactInquiry> {
        try {
            const inquiry = await this.contactInquiryModel.create({
                ...createContactInquiryDto,
                ipAddress,
                userAgent,
            });

            // Discord 웹훅 전송
            await this.sendDiscordNotification(inquiry);

            return inquiry;
        } catch (error) {
            throw new InternalServerErrorException(
                '문의 등록 중 오류가 발생했습니다.',
            );
        }
    }

    private async sendDiscordNotification(
        inquiry: ContactInquiry,
    ): Promise<void> {
        try {
            const settings = await this.getContactSettings();

            if (!settings.discordEnabled || !settings.discordWebhookUrl) {
                return;
            }

            const embed = {
                title: settings.discordMessageTitle,
                color: parseInt(
                    settings.discordEmbedColor.replace('#', ''),
                    16,
                ),
                fields: [
                    {
                        name: '👤 이름',
                        value: inquiry.name,
                        inline: true,
                    },
                    {
                        name: '📧 이메일',
                        value: inquiry.email,
                        inline: true,
                    },
                    {
                        name: '📞 전화번호',
                        value: inquiry.phone,
                        inline: true,
                    },
                    {
                        name: '🏢 회사',
                        value: inquiry.company || '미입력',
                        inline: true,
                    },
                    {
                        name: '📂 문의 유형',
                        value: inquiry.inquiryType,
                        inline: true,
                    },
                    {
                        name: '🚨 긴급도',
                        value: inquiry.isUrgent ? '긴급' : '일반',
                        inline: true,
                    },
                    {
                        name: '📝 제목',
                        value: inquiry.subject,
                        inline: false,
                    },
                    {
                        name: '💬 내용',
                        value:
                            inquiry.message.length > 1000
                                ? inquiry.message.substring(0, 1000) + '...'
                                : inquiry.message,
                        inline: false,
                    },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: `문의 ID: ${(inquiry as any)._id}`,
                },
            };

            await axios.post(settings.discordWebhookUrl, {
                embeds: [embed],
            });
        } catch (error) {
            console.error('Discord 웹훅 전송 실패:', error);
            // Discord 전송 실패는 문의 등록에 영향주지 않음
        }
    }
}

export class NoticeResponseDto {
  _id: string;
  title: string;
  content: string;
  summary?: string; // 미리보기용 요약
  isPublished: boolean;
  isModal: boolean;
  modalEndDate?: Date;
  author?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  attachments?: {
    name: string;
    url: string;
    key: string;
  }[];
} 
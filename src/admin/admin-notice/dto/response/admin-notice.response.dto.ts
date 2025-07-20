export class AdminNoticeResponseDto {
  _id: string;
  title: string;
  content: string;
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
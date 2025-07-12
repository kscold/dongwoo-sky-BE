export class NoticeResponseDto {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  isModal: boolean;
  modalEndDate?: Date;
  author?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
} 
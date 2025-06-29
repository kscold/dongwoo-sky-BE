export class AdminContactResponseDto {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

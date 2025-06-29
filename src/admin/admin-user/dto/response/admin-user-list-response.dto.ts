import { UserRole } from '../../../../schema/user.schema';

export class AdminUserListItemDto {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
}

export class AdminUserListResponseDto {
  users: AdminUserListItemDto[];
}

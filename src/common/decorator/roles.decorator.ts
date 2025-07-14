import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../admin/admin-user/dto/request/auth-request.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

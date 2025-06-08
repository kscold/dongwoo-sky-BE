import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private adminService: AdminService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    const token = authHeader.replace('Bearer ', '');
    const isValid = this.adminService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    // 관리자 정보를 request에 추가
    request.admin = { username: 'admin', token };
    return true;
  }
}

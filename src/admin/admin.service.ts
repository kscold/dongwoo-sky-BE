import { Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminService {
  // 환경변수에서 관리자 계정 정보 가져오기
  private readonly adminUsername = process.env.ADMIN_USERNAME || 'admin';
  private readonly adminPassword = process.env.ADMIN_PASSWORD || 'dongwoo2024!';

  async validateAdmin(adminLoginDto: AdminLoginDto): Promise<boolean> {
    const { username, password } = adminLoginDto;

    return username === this.adminUsername && password === this.adminPassword;
  }

  async login(
    adminLoginDto: AdminLoginDto,
  ): Promise<{ success: boolean; message: string; token?: string }> {
    const isValid = await this.validateAdmin(adminLoginDto);

    if (!isValid) {
      return {
        success: false,
        message: '잘못된 관리자 계정 정보입니다.',
      };
    }

    // 간단한 JWT 토큰 대신 세션 기반 인증 사용
    const token = this.generateSimpleToken();

    return {
      success: true,
      message: '로그인에 성공했습니다.',
      token,
    };
  }

  private generateSimpleToken(): string {
    // 간단한 토큰 생성 (실제 운영에서는 JWT 사용 권장)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    return `admin_${timestamp}_${randomString}`;
  }

  validateToken(token: string): boolean {
    // 간단한 토큰 검증 (실제 운영에서는 더 복잡한 검증 필요)
    return token && token.startsWith('admin_');
  }
}

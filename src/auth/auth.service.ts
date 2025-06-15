import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };

    // 마지막 로그인 시간 업데이트
    await this.usersService.updateLastLogin(user._id);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.USER, // 기본적으로 일반 사용자로 등록
    });

    const { password, ...result } = user as any;
    return result;
  }

  async registerAdmin(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.ADMIN, // 관리자로 등록
    });

    const { password, ...result } = user as any;
    return result;
  }
}

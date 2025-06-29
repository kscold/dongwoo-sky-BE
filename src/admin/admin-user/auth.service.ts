import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './admin-user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from '../../schema/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validateUser(email, password);
      if (user) {
        this.logger.log(`User validation successful for email: ${email}`);
        return user;
      }
      this.logger.warn(`User validation failed for email: ${email}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${email}`, error.stack);
      throw new UnauthorizedException('인증에 실패했습니다.');
    }
  }

  async login(user: any) {
    try {
      if (!user || !user._id) {
        throw new BadRequestException('유효하지 않은 사용자 정보입니다.');
      }

      const payload = {
        email: user.email,
        sub: user._id.toString(),
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      };

      // 마지막 로그인 시간 업데이트
      await this.usersService.updateLastLogin(user._id);

      const accessToken = this.jwtService.sign(payload);

      this.logger.log(
        `User login successful: ${user.email}, Role: ${user.role}`,
      );

      return {
        success: true,
        access_token: accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: new Date(),
        },
        message: '로그인이 성공했습니다.',
      };
    } catch (error) {
      this.logger.error(`Login error for user: ${user?.email}`, error.stack);
      throw new UnauthorizedException('로그인에 실패했습니다.');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        ...registerDto,
        role: UserRole.USER, // 기본적으로 일반 사용자로 등록
      });

      const { password, ...result } = user as any;
      this.logger.log(`User registered successfully: ${registerDto.email}`);
      return {
        success: true,
        user: result,
        message: '회원가입이 완료되었습니다.',
      };
    } catch (error) {
      this.logger.error(
        `Registration error for: ${registerDto.email}`,
        error.stack,
      );
      throw new BadRequestException('회원가입에 실패했습니다.');
    }
  }

  async registerAdmin(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        ...registerDto,
        role: UserRole.ADMIN, // 관리자로 등록
      });

      const { password, ...result } = user as any;
      this.logger.log(`Admin registered successfully: ${registerDto.email}`);
      return {
        success: true,
        user: result,
        message: '관리자 계정이 생성되었습니다.',
      };
    } catch (error) {
      this.logger.error(
        `Admin registration error for: ${registerDto.email}`,
        error.stack,
      );
      throw new BadRequestException('관리자 계정 생성에 실패했습니다.');
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      return {
        valid: true,
        user: {
          id: decoded.sub,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }
  }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);
    try {
      const result = await this.authService.login(req.user);
      this.logger.log(`Login successful for email: ${loginDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${loginDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log(
        `Registration successful for email: ${registerDto.email}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${registerDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(@Body() registerDto: RegisterDto) {
    this.logger.log(
      `Admin registration attempt for email: ${registerDto.email}`,
    );
    try {
      const result = await this.authService.registerAdmin(registerDto);
      this.logger.log(
        `Admin registration successful for email: ${registerDto.email}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Admin registration failed for email: ${registerDto.email}`,
        error.stack,
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    this.logger.log(`Profile request for user: ${req.user.email}`);
    return {
      success: true,
      user: req.user,
      message: '프로필 정보를 성공적으로 가져왔습니다.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Request() req) {
    this.logger.log(`Token verification for user: ${req.user.email}`);
    return {
      success: true,
      valid: true,
      user: req.user,
      message: '토큰이 유효합니다.',
    };
  }
}

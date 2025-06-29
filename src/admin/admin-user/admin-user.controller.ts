import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Param,
  Delete,
  Logger,
  BadRequestException,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { UserRole } from '../../schema/user.schema';
import { AdminUserListResponseDto } from './dto/response/admin-user-list-response.dto';
import { AdminApproveUserRequestDto } from './dto/request/admin-user-approve-request.dto';
import { AdminUserCreateRequestDto } from './dto/request/admin-user-create-request.dto';
import { AdminUpdateUserRequestDto } from './dto/request/admin-user-update-request.dto';
import { LocalAuthGuard } from '../../common/guard/local-auth.guard';
import { AdminUserLoginRequestDto } from './dto/request/admin-user-login-request.dto';

@Controller('admin/user')
export class AdminUserController {
  private readonly logger = new Logger(AdminUserController.name);

  constructor(private readonly adminUserService: AdminUserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.adminUserService.login(req.user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AdminUserCreateRequestDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);
    try {
      const result = await this.adminUserService.register(
        registerDto,
        UserRole.CUSTOMER,
      );
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(@Body() registerDto: AdminUserCreateRequestDto) {
    this.logger.log(
      `Admin registration attempt for email: ${registerDto.email}`,
    );
    try {
      const result = await this.adminUserService.register(
        registerDto,
        UserRole.ADMIN,
      );
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

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserList(): Promise<AdminUserListResponseDto> {
    try {
      return await this.adminUserService.getUserList();
    } catch (error) {
      this.logger.error(`[getUserList] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 목록 조회에 실패했습니다.');
    }
  }

  @Patch('approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveUser(
    @Body() dto: AdminApproveUserRequestDto,
  ): Promise<{ success: boolean }> {
    try {
      return await this.adminUserService.approveUser(dto);
    } catch (error) {
      this.logger.error(`[approveUser] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 승인에 실패했습니다.');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserDetails(@Param('id') id: string) {
    try {
      return await this.adminUserService.getUserById(id);
    } catch (error) {
      this.logger.error(`[getUserDetails] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 상세 정보 조회에 실패했습니다.');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: AdminUpdateUserRequestDto,
  ) {
    try {
      return await this.adminUserService.updateUserByAdmin(id, updateUserDto);
    } catch (error) {
      this.logger.error(`[updateUser] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 정보 수정에 실패했습니다.');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.adminUserService.deleteUserByAdmin(id);
    } catch (error) {
      this.logger.error(`[deleteUser] ${error.message}`, error.stack);
      throw new BadRequestException('사용자 삭제에 실패했습니다.');
    }
  }
}

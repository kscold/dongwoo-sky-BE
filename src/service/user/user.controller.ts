import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateRequestDto } from './dto/request/user-create-request.dto';

@Controller('service/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: UserCreateRequestDto) {
    try {
      const user = await this.userService.register(createUserDto);
      return {
        success: true,
        message:
          '회원가입 신청이 완료되었습니다. 관리자 승인 후 로그인이 가능합니다.',
        user,
      };
    } catch (error) {
      this.logger.error(`[register] ${error.message}`, error.stack);
      throw new BadRequestException(
        error.message || '회원가입에 실패했습니다.',
      );
    }
  }
}

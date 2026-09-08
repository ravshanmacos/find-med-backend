import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AcceptDoctorInviteDto } from './dto/accept-doctor-invite.dto';
import { JwtAuthGuard } from '../config/guards/jwt-auth.guard';
import { RolesGuard } from '../config/guards/roles.guard';
import { Roles } from '../config/decorators/roles.decorator';

// Note: register/login/refresh/logout/accept-invite are intentionally
// unguarded — they must be reachable without authentication. Only
// invite creation is restricted to ADMIN.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('doctors/:doctorId/invite')
  createDoctorInvite(@Param('doctorId', ParseUUIDPipe) doctorId: string) {
    return this.authService.createDoctorInvite(doctorId);
  }

  @Post('doctors/accept-invite')
  acceptDoctorInvite(@Body() dto: AcceptDoctorInviteDto) {
    return this.authService.acceptDoctorInvite(dto);
  }
}

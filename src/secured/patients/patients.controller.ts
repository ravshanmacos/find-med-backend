import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PatientsService } from './providers/patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../../config/guards/jwt-auth.guard';
import { RolesGuard } from '../../config/guards/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';
import { CurrentUser } from '../../config/decorators/current-user.decorator';
import { Principal } from '../../common/principal';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PATIENT')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  getMe(@CurrentUser() user: Principal) {
    return this.patientsService.findByUserId(user.userId);
  }

  @Patch('me')
  updateMe(@Body() dto: UpdatePatientDto, @CurrentUser() user: Principal) {
    return this.patientsService.updateOwn(user.userId, dto);
  }
}

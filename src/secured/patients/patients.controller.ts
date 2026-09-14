import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PatientsService } from './providers/patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard, RolesGuard } from 'src/config/guards';
import { Roles } from 'src/config/decorators/roles.decorator';
import { CurrentUser } from 'src/config/decorators/current-user.decorator';
import { Principal } from 'src/common/principal';

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

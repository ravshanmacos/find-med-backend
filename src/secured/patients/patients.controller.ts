import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from '../../config/guards/jwt-auth.guard';
import { RolesGuard } from '../../config/guards/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PATIENT')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.patientsService.findByUserId(req.user.userId);
  }

  @Patch('me')
  updateMe(@Body() dto: UpdatePatientDto, @Req() req) {
    return this.patientsService.updateOwn(req.user.userId, dto);
  }
}

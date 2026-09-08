import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './providers/doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AssignSpecialtyDto } from './dto/assign-specialty.dto';
import { JwtAuthGuard } from '../../config/guards/jwt-auth.guard';
import { RolesGuard } from '../../config/guards/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';
import { CurrentUser } from '../../config/decorators/current-user.decorator';
import { Principal } from '../../common/principal';

// Note: the GET routes are intentionally unguarded — the discovery layer
// must let patients browse doctors without logging in.
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  search(
    @Query('search') search?: string,
    @Query('specialtyId') specialtyId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.doctorsService.search(
      search,
      specialtyId ? Number(specialtyId) : undefined,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.doctorsService.findOneWithSpecialties(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDoctorDto,
    @CurrentUser() user: Principal,
  ) {
    return this.doctorsService.updateProfile(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @Post(':id/specialties')
  assignSpecialty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignSpecialtyDto,
    @CurrentUser() user: Principal,
  ) {
    return this.doctorsService.assignSpecialty(id, dto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  @Delete(':id/specialties/:specialtyId')
  unassignSpecialty(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('specialtyId', ParseIntPipe) specialtyId: number,
    @CurrentUser() user: Principal,
  ) {
    return this.doctorsService.unassignSpecialty(id, specialtyId, user);
  }
}

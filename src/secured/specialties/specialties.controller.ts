import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SpecialtiesService } from './providers/specialties.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { JwtAuthGuard } from '../../config/guards/jwt-auth.guard';
import { RolesGuard } from '../../config/guards/roles.guard';
import { Roles } from '../../config/decorators/roles.decorator';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  list() {
    return this.specialtiesService.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtiesService.create(dto);
  }
}

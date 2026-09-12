import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RegionsService } from './providers/regions.service';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  list() {
    return this.regionsService.list();
  }

  @Get(':id/districts')
  districts(@Param('id', ParseIntPipe) id: number) {
    return this.regionsService.districtsByRegion(id);
  }
}

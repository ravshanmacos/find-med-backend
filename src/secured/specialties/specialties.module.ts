import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './providers/specialties.service';
import { SpecialtiesProviders } from './providers';

@Module({
  controllers: [SpecialtiesController],
  providers: [...SpecialtiesProviders],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}

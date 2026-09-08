import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './providers/patients.service';
import { PatientsProviders } from './providers';

@Module({
  controllers: [PatientsController],
  providers: [...PatientsProviders],
  exports: [PatientsService],
})
export class PatientsModule {}

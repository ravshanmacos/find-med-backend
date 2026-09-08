import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './secured/doctors/doctors.module';
import { PatientsModule } from './secured/patients/patients.module';
import { SpecialtiesModule } from './secured/specialties/specialties.module';

@Module({
  imports: [AuthModule, DoctorsModule, PatientsModule, SpecialtiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

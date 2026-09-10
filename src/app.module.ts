import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './secured/doctors/doctors.module';
import { PatientsModule } from './secured/patients/patients.module';
import { SpecialtiesModule } from './secured/specialties/specialties.module';
import { WorkplacesModule } from './secured/workplaces/workplaces.module';
import { RegionsModule } from './secured/regions/regions.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    DoctorsModule,
    PatientsModule,
    SpecialtiesModule,
    WorkplacesModule,
    RegionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

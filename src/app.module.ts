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
import { UsersModule } from './auth/modules/users/users.module';
import { DoctorInviteModule } from './auth/modules/doctorInvite/doctor-invite.module';
import { RefreshTokenModule } from './auth/modules/refreshTokens/refresh-token.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    DoctorsModule,
    PatientsModule,
    SpecialtiesModule,
    WorkplacesModule,
    RegionsModule,
    UsersModule,
    DoctorInviteModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

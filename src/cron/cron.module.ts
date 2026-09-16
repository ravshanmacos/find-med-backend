import { Module } from '@nestjs/common';
import { CronProviders } from './providers';

@Module({
  imports: [],
  providers: CronProviders,
  exports: [],
})
export class CronModule {}

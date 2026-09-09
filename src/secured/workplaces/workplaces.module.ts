import { Module } from '@nestjs/common';
import { WorkplacesController } from './workplaces.controller';
import { WorkplacesService } from './providers/workplaces.service';
import { WorkplacesProviders } from './providers';

@Module({
  controllers: [WorkplacesController],
  providers: [...WorkplacesProviders],
  exports: [WorkplacesService],
})
export class WorkplacesModule {}

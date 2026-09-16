import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommonCronService, ICronRunner } from '../models/cron.model';
import { CronNames } from '../../common/constants/constants';

@Injectable()
export class CropCron extends CommonCronService implements ICronRunner {
  // @Inject()
  // private cropTypesMethod: GetCropTypesMethod;

  @Cron(CronExpression.EVERY_MINUTE, {
    name: CronNames.CROP_CRON,
  })
  async cronTask() {
    await this.cronHandler(this);
  }

  name = CronNames.CROP_CRON;

  async run() {
    // const user = { id: 'dafeb936-dac1-4ab1-9d88-7e2b62565d64' } as Principal;
    // await this.cropTypesMethod.sync(user);
    // await this.cropGenerationMethod.sync(user);
  }
}

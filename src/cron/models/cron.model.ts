import { CronNames } from 'src/common/constants/constants';
import { Injectable, Inject } from '@nestjs/common';
import { CronDao } from '../providers/cron.dao';
import { CronHandlerService } from '../providers/cron.service';

interface ICronFields {
  name: CronNames;
  cronDao: CronDao;
}

export interface ICronRunner {
  run: (pool?: any) => Promise<any>;
}

export interface ICronCommon extends ICronFields, ICronRunner {}

@Injectable()
export class CommonCronService
  extends CronHandlerService
  implements ICronFields
{
  name: CronNames;

  @Inject()
  cronDao: CronDao;
}

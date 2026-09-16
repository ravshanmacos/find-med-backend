import { CronDao } from './cron.dao';
import { PoolService } from 'src/core/pool.service';
import { CropCron } from '../cron-tasks/crop.cron';

const providers: any[] = [{ useClass: CronDao, provide: CronDao }, PoolService];

if (process.env.CROP_CRON == 'true') {
  providers.push(CropCron);
}

export const CronProviders = providers;

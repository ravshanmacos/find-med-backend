import { Inject, Injectable } from '@nestjs/common';
import { PoolService } from '../../core/pool.service';
import { ICronCommon } from '../models/cron.model';
import { CronPoolService } from '../../core/cron-pool.service';

@Injectable()
export abstract class CronHandlerService {
  runCron: any = {};

  @Inject()
  protected readonly poolService: PoolService;

  async cronHandler(service: ICronCommon) {
    if (process.env.RUNNING_MODE !== 'cron') {
      const cron_time_name = service.name + new Date().getTime().toString();
      const pool_for_init = new CronPoolService(cron_time_name).pool;

      let cron: any;
      try {
        cron = await service.cronDao.findByName(pool_for_init, service.name);
      } catch (error) {
        console.error({ place: 'CronFindByName', error });
      }

      if (!cron) {
        try {
          await service.cronDao.insertWithoutId(pool_for_init, {
            name: service.name,
          });

          const pool = new CronPoolService(cron_time_name).pool;
          await service.run(pool);
        } catch (error) {
          console.error('Cron handler error ' + cron_time_name, error);
        } finally {
          const pool_for_delete = new CronPoolService(cron_time_name).pool;
          await service.cronDao.deleteByName(pool_for_delete, service.name);
        }
      }
    } else {
      if (this.runCron[service.name]) return;
      this.runCron[service.name] = service.name + new Date().getTime();
      try {
        await service.run(this.poolService.pool);
      } catch (error) {
        console.error('Cron_handler Error: ' + service.name, error);
      } finally {
        this.runCron[service.name] = null;
      }
    }
  }
}

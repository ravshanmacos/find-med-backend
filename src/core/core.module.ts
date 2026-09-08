import { Global, Module } from '@nestjs/common';
import { PoolService } from './pool.service';

// @Global() — imported once in AppModule, then PoolService can be
// injected anywhere without adding it to that module's providers.
@Global()
@Module({
  providers: [PoolService],
  exports: [PoolService],
})
export class CoreModule {}

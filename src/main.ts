import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from 'process';
import cors from 'cors';
import { migrate } from './core/base.dao';

async function bootstrap() {
  const { RUNNING_MODE, PORT, SWAGGER_ENABLE } = process.env;
  const app = await NestFactory.create(AppModule);

  // app.set('trust proxy', 1);
  if (RUNNING_MODE === 'develop') {
    app.use(cors());
  }

  // if (SWAGGER_ENABLE === 'true') await AddSwaggerDocumentation(app);
  await app.listen(PORT!, () => {
    console.log(`API run on http://localhost:${PORT}`);
    if (SWAGGER_ENABLE === 'true')
      console.log(`API run on http://localhost:${PORT}/swagger`);
  });
}
migrate().then(() => bootstrap());
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import process from 'process';
import cors from 'cors';
import { migrate } from './core/base.dao';
import { AddSwaggerDocumentation } from './add-swagger-documentation';

async function bootstrap() {
  const { RUNNING_MODE, PORT, SWAGGER_ENABLE } = process.env;
  const app = await NestFactory.create(AppModule);

  // Note: without this, the class-validator decorators on DTOs
  // (e.g. @IsEmail, @MinLength) perform no validation at all.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // app.set('trust proxy', 1);
  if (RUNNING_MODE === 'develop') {
    app.use(cors());
  }

  if (SWAGGER_ENABLE === 'true') await AddSwaggerDocumentation(app);
  await app.listen(PORT!, () => {
    console.log(`API run on http://localhost:${PORT}`);
    if (SWAGGER_ENABLE === 'true')
      console.log(`API run on http://localhost:${PORT}/swagger`);
  });
}
migrate().then(() => bootstrap());
// bootstrap();

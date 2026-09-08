import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';

export const AddSwaggerDocumentation = async (app: INestApplication) => {
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use(
    ['/swagger'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER!]: process.env.SWAGGER_PASSWORD!,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('FindMed Nest API')
    .setDescription('Information system FindMed-Nest-backend')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'Bearer',
      description: 'Bearer token for external calls',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, customOptions);
};

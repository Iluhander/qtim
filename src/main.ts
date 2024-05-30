import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Укажите JWT access-токен',
        in: 'header'
      },
      'JWT-auth'
    )
    .setTitle('QTIM')
    .setDescription('Auth and articles app')
    .setVersion('1.0.0');

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}
Documentation: http://localhost:${PORT}/api-docs/`),
  );
}
bootstrap();
function cookieParser(): any {
  throw new Error('Function not implemented.');
}


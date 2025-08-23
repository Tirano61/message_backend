import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:59074',   // puerto del servidor dev Flutter (ajusta)
      'http://127.0.0.1:59074',
      'http://localhost:8080',    // otros orígenes que uses
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

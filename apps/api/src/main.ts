import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: config.webOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not declared in the DTO
      forbidNonWhitelisted: true, // reject requests with unknown properties
      transform: true, // auto-convert payloads into DTO instances
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const apiPort = config.apiPort;
  await app.listen(apiPort, '127.0.0.1');
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${config.apiPort} [${config.nodeEnv}]`);
}

bootstrap().catch((error: unknown) => {
  process.stderr.write(`API bootstrap failed: ${String(error)}\n`);
  process.exitCode = 1;
});

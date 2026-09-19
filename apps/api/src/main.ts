import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Personal Finance ERP API')
    .setDescription(
      'REST API for personal finance accounts, transactions, reports, budgets, goals and investments.',
    )
    .setVersion('0.1.0')
    .addTag('health', 'Service health and database connectivity')
    .addTag('auth', 'Google OAuth and session management')
    .addTag('accounts', 'User financial accounts')
    .addTag('transactions', 'Income, expense and transfer records')
    .addTag('categories', 'Income, expense and investment categories')
    .addTag('cost-centers', 'User cost centers')
    .addTag('reports', 'DRE, cash flow and balance sheet')
    .addTag('dashboard', 'Financial dashboard KPIs')
    .addTag('budgets', 'Monthly budgets')
    .addTag('financial-goals', 'Financial goals')
    .addTag('strategic-planning', 'Strategic plans, objectives and tactical actions')
    .addTag('investments', 'Investment positions')
    .addCookieAuth('finance_session', { type: 'apiKey', in: 'cookie' })
    .addServer(`http://localhost:${config.apiPort}`, 'Local development')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'docs/openapi.json',
    customSiteTitle: 'Personal Finance ERP API docs',
  });

  const apiPort = config.apiPort;
  await app.listen(apiPort, '127.0.0.1');
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${config.apiPort} [${config.nodeEnv}]`);
}

bootstrap().catch((error: unknown) => {
  process.stderr.write(`API bootstrap failed: ${String(error)}\n`);
  process.exitCode = 1;
});

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionAuthGuard } from './modules/auth/session-auth.guard';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        // Generous default for the whole API; auth endpoints apply a
        // stricter limit of their own once the auth module is implemented.
        ttl: 60_000,
        limit: 120,
      },
    ]),
    HealthModule,
    AuthModule,
    // Domain modules (auth, accounts, transactions, ...) are registered
    // here incrementally as each implementation phase lands.
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: SessionAuthGuard },
  ],
})
export class AppModule {}

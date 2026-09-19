import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthModule } from './modules/health/health.module';

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
    // Domain modules (auth, accounts, transactions, ...) are registered
    // here incrementally as each implementation phase lands.
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // A global SessionAuthGuard is added in Phase 2 (Authentication), so
    // that every route is protected by default except those marked
    // @Public(). Until then, no route requires authentication.
  ],
})
export class AppModule {}

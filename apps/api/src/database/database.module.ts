import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        ...config.database,
        autoLoadEntities: true,
        // Migrations are the only source of schema truth — never auto-sync.
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}

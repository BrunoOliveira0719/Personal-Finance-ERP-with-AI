import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Public()
  @Get()
  async check() {
    const databaseConnected = this.dataSource.isInitialized;

    return {
      status: databaseConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      database: databaseConnected ? 'connected' : 'disconnected',
    };
  }
}

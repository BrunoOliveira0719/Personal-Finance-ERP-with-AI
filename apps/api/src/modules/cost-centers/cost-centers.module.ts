import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { CostCenter } from './entities/cost-center.entity';
import { CostCentersController } from './cost-centers.controller';
import { CostCentersService } from './cost-centers.service';
@Module({
  imports: [TypeOrmModule.forFeature([CostCenter]), ActivityLogsModule],
  controllers: [CostCentersController],
  providers: [CostCentersService],
})
export class CostCentersModule {}

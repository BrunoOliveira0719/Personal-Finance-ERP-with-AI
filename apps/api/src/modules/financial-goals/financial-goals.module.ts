import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { FinancialGoal } from './entities/financial-goal.entity';
import { FinancialGoalsController } from './financial-goals.controller';
import { FinancialGoalsService } from './financial-goals.service';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialGoal]), ActivityLogsModule],
  controllers: [FinancialGoalsController],
  providers: [FinancialGoalsService],
})
export class FinancialGoalsModule {}

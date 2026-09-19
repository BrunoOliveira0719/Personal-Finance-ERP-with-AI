import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { Budget } from './entities/budget.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

@Module({
	imports: [TypeOrmModule.forFeature([Budget]), ActivityLogsModule],
	controllers: [BudgetsController],
	providers: [BudgetsService],
})
export class BudgetsModule {}

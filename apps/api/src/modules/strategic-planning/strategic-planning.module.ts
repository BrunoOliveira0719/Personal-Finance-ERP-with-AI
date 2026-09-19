import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { StrategicObjective } from './entities/strategic-objective.entity';
import { StrategicPlan } from './entities/strategic-plan.entity';
import { TacticalAction } from './entities/tactical-action.entity';
import { StrategicPlanningController } from './strategic-planning.controller';
import { StrategicPlanningService } from './strategic-planning.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StrategicPlan, StrategicObjective, TacticalAction]),
    ActivityLogsModule,
  ],
  controllers: [StrategicPlanningController],
  providers: [StrategicPlanningService],
})
export class StrategicPlanningModule {}

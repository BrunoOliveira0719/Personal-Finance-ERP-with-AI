import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialGoal } from './entities/financial-goal.entity';
import { FinancialGoalsController } from './financial-goals.controller';
@Module({
  imports: [TypeOrmModule.forFeature([FinancialGoal])],
  controllers: [FinancialGoalsController],
})
export class FinancialGoalsModule {}

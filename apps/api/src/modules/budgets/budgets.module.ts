import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { BudgetsController } from './budgets.controller';
@Module({ imports: [TypeOrmModule.forFeature([Budget])], controllers: [BudgetsController] })
export class BudgetsModule {}

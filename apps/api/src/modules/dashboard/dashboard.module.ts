import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { DashboardController } from './dashboard.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [DashboardController],
})
export class DashboardModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

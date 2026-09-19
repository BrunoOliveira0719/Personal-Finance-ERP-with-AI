import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { InvestmentsController } from './investments.controller';
@Module({ imports: [TypeOrmModule.forFeature([Investment])], controllers: [InvestmentsController] })
export class InvestmentsModule {}

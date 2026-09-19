import { Controller, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { FinancialGoal } from './entities/financial-goal.entity';
@Controller('financial-goals')
export class FinancialGoalsController {
  constructor(@InjectRepository(FinancialGoal) private readonly repo: Repository<FinancialGoal>) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.repo.find({ where: { userId: req.user.id }, order: { createdAt: 'DESC' } });
  }
}

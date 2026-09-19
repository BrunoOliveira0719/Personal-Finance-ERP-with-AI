import { Controller, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { Budget } from './entities/budget.entity';
@Controller('budgets')
export class BudgetsController {
  constructor(@InjectRepository(Budget) private readonly repo: Repository<Budget>) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.repo.find({ where: { userId: req.user.id }, order: { periodMonth: 'DESC' } });
  }
}

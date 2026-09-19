import { Controller, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { Investment } from './entities/investment.entity';
@Controller('investments')
export class InvestmentsController {
  constructor(@InjectRepository(Investment) private readonly repo: Repository<Investment>) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.repo.find({ where: { userId: req.user.id }, order: { ticker: 'ASC' } });
  }
}

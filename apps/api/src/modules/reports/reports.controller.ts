import { Controller, Get, Query, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { ReportsService } from './reports.service';
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}
  @Get('dre') dre(
    @Req() req: AuthenticatedRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.summary(req.user.id, from, to);
  }
  @Get('cash-flow') cashFlow(
    @Req() req: AuthenticatedRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.summary(req.user.id, from, to);
  }
  @Get('balance-sheet') balanceSheet(@Req() req: AuthenticatedRequest) {
    return this.service.balanceSheet(req.user.id);
  }
}

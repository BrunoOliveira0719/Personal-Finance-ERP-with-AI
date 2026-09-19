import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { CostCentersService } from './cost-centers.service';
@Controller('cost-centers')
export class CostCentersController {
  constructor(private readonly service: CostCentersService) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.service.listForUser(req.user.id);
  }
  @Post() create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCostCenterDto) {
    return this.service.createForUser(req.user.id, dto);
  }
}

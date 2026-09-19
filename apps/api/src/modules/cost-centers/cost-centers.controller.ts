import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
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
  @Patch(':id') update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCostCenterDto,
  ) {
    return this.service.updateForUser(req.user.id, id, dto);
  }
  @Delete(':id') remove(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteForUser(req.user.id, id);
  }
}

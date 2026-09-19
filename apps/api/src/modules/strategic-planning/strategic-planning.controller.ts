import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateStrategicObjectiveDto } from './dto/create-strategic-objective.dto';
import { CreateStrategicPlanDto } from './dto/create-strategic-plan.dto';
import { CreateTacticalActionDto } from './dto/create-tactical-action.dto';
import { UpdateStrategicObjectiveDto } from './dto/update-strategic-objective.dto';
import { UpdateStrategicPlanDto } from './dto/update-strategic-plan.dto';
import { UpdateTacticalActionDto } from './dto/update-tactical-action.dto';
import { StrategicPlanningService } from './strategic-planning.service';

@Controller()
export class StrategicPlanningController {
  constructor(private readonly service: StrategicPlanningService) {}

  @Get('strategic-plans')
  listPlans(@Req() req: AuthenticatedRequest) {
    return this.service.listPlans(req.user.id);
  }

  @Post('strategic-plans')
  createPlan(@Req() req: AuthenticatedRequest, @Body() dto: CreateStrategicPlanDto) {
    return this.service.createPlan(req.user.id, dto);
  }

  @Patch('strategic-plans/:id')
  updatePlan(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStrategicPlanDto,
  ) {
    return this.service.updatePlan(req.user.id, id, dto);
  }

  @Delete('strategic-plans/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    await this.service.deletePlan(req.user.id, id);
  }

  @Get('strategic-objectives')
  listObjectives(@Req() req: AuthenticatedRequest, @Query('planId') planId?: string) {
    return this.service.listObjectives(req.user.id, planId);
  }

  @Post('strategic-objectives')
  createObjective(@Req() req: AuthenticatedRequest, @Body() dto: CreateStrategicObjectiveDto) {
    return this.service.createObjective(req.user.id, dto);
  }

  @Patch('strategic-objectives/:id')
  updateObjective(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStrategicObjectiveDto,
  ) {
    return this.service.updateObjective(req.user.id, id, dto);
  }

  @Delete('strategic-objectives/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteObjective(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    await this.service.deleteObjective(req.user.id, id);
  }

  @Get('tactical-actions')
  listActions(@Req() req: AuthenticatedRequest, @Query('objectiveId') objectiveId?: string) {
    return this.service.listActions(req.user.id, objectiveId);
  }

  @Post('tactical-actions')
  createAction(@Req() req: AuthenticatedRequest, @Body() dto: CreateTacticalActionDto) {
    return this.service.createAction(req.user.id, dto);
  }

  @Patch('tactical-actions/:id')
  updateAction(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTacticalActionDto,
  ) {
    return this.service.updateAction(req.user.id, id, dto);
  }

  @Delete('tactical-actions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAction(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    await this.service.deleteAction(req.user.id, id);
  }
}

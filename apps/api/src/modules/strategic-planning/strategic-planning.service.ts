import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateStrategicObjectiveDto } from './dto/create-strategic-objective.dto';
import { CreateStrategicPlanDto } from './dto/create-strategic-plan.dto';
import { CreateTacticalActionDto } from './dto/create-tactical-action.dto';
import { UpdateStrategicObjectiveDto } from './dto/update-strategic-objective.dto';
import { UpdateStrategicPlanDto } from './dto/update-strategic-plan.dto';
import { UpdateTacticalActionDto } from './dto/update-tactical-action.dto';
import {
  StrategicObjective,
  StrategicObjectiveStatus,
} from './entities/strategic-objective.entity';
import { StrategicPlan, StrategicPlanStatus } from './entities/strategic-plan.entity';
import { TacticalAction, TacticalActionStatus } from './entities/tactical-action.entity';

@Injectable()
export class StrategicPlanningService {
  constructor(
    @InjectRepository(StrategicPlan) private readonly plans: Repository<StrategicPlan>,
    @InjectRepository(StrategicObjective)
    private readonly objectives: Repository<StrategicObjective>,
    @InjectRepository(TacticalAction) private readonly actions: Repository<TacticalAction>,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  listPlans(userId: string): Promise<StrategicPlan[]> {
    return this.plans.find({ where: { userId }, order: { horizonStart: 'DESC' } });
  }

  async createPlan(userId: string, dto: CreateStrategicPlanDto): Promise<StrategicPlan> {
    const plan = await this.plans.save(
      this.plans.create({
        userId,
        name: dto.name,
        vision: dto.vision ?? null,
        horizonStart: dto.horizonStart,
        horizonEnd: dto.horizonEnd,
        status: dto.status ?? StrategicPlanStatus.ACTIVE,
      }),
    );
    await this.log(userId, 'strategicPlan', plan.id, 'CREATE', plan.name, `Created plan ${plan.name}`);
    return plan;
  }

  async updatePlan(userId: string, id: string, dto: UpdateStrategicPlanDto): Promise<StrategicPlan> {
    const plan = await this.getPlan(userId, id);
    Object.assign(plan, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.vision !== undefined ? { vision: dto.vision ?? null } : {}),
      ...(dto.horizonStart !== undefined ? { horizonStart: dto.horizonStart } : {}),
      ...(dto.horizonEnd !== undefined ? { horizonEnd: dto.horizonEnd } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });
    const updated = await this.plans.save(plan);
    await this.log(userId, 'strategicPlan', updated.id, 'UPDATE', updated.name, `Updated plan ${updated.name}`);
    return updated;
  }

  async deletePlan(userId: string, id: string): Promise<void> {
    const plan = await this.getPlan(userId, id);
    await this.plans.remove(plan);
    await this.log(userId, 'strategicPlan', id, 'DELETE', plan.name, `Deleted plan ${plan.name}`);
  }

  listObjectives(userId: string, planId?: string): Promise<StrategicObjective[]> {
    return this.objectives.find({
      where: { userId, ...(planId ? { planId } : {}) },
      order: { createdAt: 'DESC' },
    });
  }

  async createObjective(userId: string, dto: CreateStrategicObjectiveDto): Promise<StrategicObjective> {
    await this.getPlan(userId, dto.planId);
    const objective = await this.objectives.save(
      this.objectives.create({
        userId,
        planId: dto.planId,
        title: dto.title,
        description: dto.description ?? null,
        perspective: dto.perspective,
        targetValueCents: dto.targetValueCents == null ? null : String(dto.targetValueCents),
        targetDate: dto.targetDate ?? null,
        status: dto.status ?? StrategicObjectiveStatus.ACTIVE,
      }),
    );
    await this.log(userId, 'strategicObjective', objective.id, 'CREATE', objective.title, `Created objective ${objective.title}`);
    return objective;
  }

  async updateObjective(userId: string, id: string, dto: UpdateStrategicObjectiveDto): Promise<StrategicObjective> {
    const objective = await this.getObjective(userId, id);
    if (dto.planId !== undefined) await this.getPlan(userId, dto.planId);
    Object.assign(objective, {
      ...(dto.planId !== undefined ? { planId: dto.planId } : {}),
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
      ...(dto.perspective !== undefined ? { perspective: dto.perspective } : {}),
      ...(dto.targetValueCents !== undefined
        ? { targetValueCents: dto.targetValueCents == null ? null : String(dto.targetValueCents) }
        : {}),
      ...(dto.targetDate !== undefined ? { targetDate: dto.targetDate ?? null } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });
    const updated = await this.objectives.save(objective);
    await this.log(userId, 'strategicObjective', updated.id, 'UPDATE', updated.title, `Updated objective ${updated.title}`);
    return updated;
  }

  async deleteObjective(userId: string, id: string): Promise<void> {
    const objective = await this.getObjective(userId, id);
    await this.objectives.remove(objective);
    await this.log(userId, 'strategicObjective', id, 'DELETE', objective.title, `Deleted objective ${objective.title}`);
  }

  listActions(userId: string, objectiveId?: string): Promise<TacticalAction[]> {
    return this.actions.find({
      where: { userId, ...(objectiveId ? { objectiveId } : {}) },
      order: { dueDate: 'ASC', createdAt: 'DESC' },
    });
  }

  async createAction(userId: string, dto: CreateTacticalActionDto): Promise<TacticalAction> {
    await this.getObjective(userId, dto.objectiveId);
    const action = await this.actions.save(
      this.actions.create({
        userId,
        objectiveId: dto.objectiveId,
        title: dto.title,
        description: dto.description ?? null,
        dueDate: dto.dueDate ?? null,
        estimatedAmountCents: dto.estimatedAmountCents == null ? null : String(dto.estimatedAmountCents),
        status: dto.status ?? TacticalActionStatus.PLANNED,
      }),
    );
    await this.log(userId, 'tacticalAction', action.id, 'CREATE', action.title, `Created action ${action.title}`);
    return action;
  }

  async updateAction(userId: string, id: string, dto: UpdateTacticalActionDto): Promise<TacticalAction> {
    const action = await this.getAction(userId, id);
    if (dto.objectiveId !== undefined) await this.getObjective(userId, dto.objectiveId);
    Object.assign(action, {
      ...(dto.objectiveId !== undefined ? { objectiveId: dto.objectiveId } : {}),
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
      ...(dto.dueDate !== undefined ? { dueDate: dto.dueDate ?? null } : {}),
      ...(dto.estimatedAmountCents !== undefined
        ? { estimatedAmountCents: dto.estimatedAmountCents == null ? null : String(dto.estimatedAmountCents) }
        : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });
    const updated = await this.actions.save(action);
    await this.log(userId, 'tacticalAction', updated.id, 'UPDATE', updated.title, `Updated action ${updated.title}`);
    return updated;
  }

  async deleteAction(userId: string, id: string): Promise<void> {
    const action = await this.getAction(userId, id);
    await this.actions.remove(action);
    await this.log(userId, 'tacticalAction', id, 'DELETE', action.title, `Deleted action ${action.title}`);
  }

  private async getPlan(userId: string, id: string): Promise<StrategicPlan> {
    const plan = await this.plans.findOne({ where: { id, userId } });
    if (!plan) throw new NotFoundException('Strategic plan not found');
    return plan;
  }

  private async getObjective(userId: string, id: string): Promise<StrategicObjective> {
    const objective = await this.objectives.findOne({ where: { id, userId } });
    if (!objective) throw new NotFoundException('Strategic objective not found');
    return objective;
  }

  private async getAction(userId: string, id: string): Promise<TacticalAction> {
    const action = await this.actions.findOne({ where: { id, userId } });
    if (!action) throw new NotFoundException('Tactical action not found');
    return action;
  }

  private log(
    userId: string,
    entity: string,
    entityId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    label: string,
    details: string,
  ) {
    return this.activityLogs.log({
      userId,
      module: 'strategic-planning',
      entity,
      entityId,
      action,
      label,
      details,
    });
  }
}

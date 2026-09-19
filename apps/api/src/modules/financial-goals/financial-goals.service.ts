import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateFinancialGoalDto } from './dto/create-financial-goal.dto';
import { UpdateFinancialGoalDto } from './dto/update-financial-goal.dto';
import { FinancialGoal, GoalStatus } from './entities/financial-goal.entity';

@Injectable()
export class FinancialGoalsService {
  constructor(
    @InjectRepository(FinancialGoal)
    private readonly goals: Repository<FinancialGoal>,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  listForUser(userId: string): Promise<FinancialGoal[]> {
    return this.goals.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createForUser(userId: string, dto: CreateFinancialGoalDto): Promise<FinancialGoal> {
    const created = await this.goals.save(
      this.goals.create({
        userId,
        name: dto.name,
        targetAmountCents: String(dto.targetAmountCents),
        currentAmountCents: String(dto.currentAmountCents ?? 0),
        targetDate: dto.targetDate ?? null,
        status: dto.status ?? GoalStatus.ACTIVE,
      }),
    );

    await this.activityLogs.log({
      userId,
      module: 'financial-goals',
      entity: 'financialGoal',
      entityId: created.id,
      action: 'CREATE',
      label: created.name,
      details: `Created financial goal ${created.name}`,
    });

    return created;
  }

  async updateForUser(
    userId: string,
    goalId: string,
    dto: UpdateFinancialGoalDto,
  ): Promise<FinancialGoal> {
    const goal = await this.goals.findOne({ where: { id: goalId, userId } });
    if (!goal) throw new NotFoundException('Financial goal not found');

    Object.assign(goal, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.targetAmountCents !== undefined
        ? { targetAmountCents: String(dto.targetAmountCents) }
        : {}),
      ...(dto.currentAmountCents !== undefined
        ? { currentAmountCents: String(dto.currentAmountCents) }
        : {}),
      ...(dto.targetDate !== undefined ? { targetDate: dto.targetDate ?? null } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });

    const updated = await this.goals.save(goal);

    await this.activityLogs.log({
      userId,
      module: 'financial-goals',
      entity: 'financialGoal',
      entityId: updated.id,
      action: 'UPDATE',
      label: updated.name,
      details: `Updated goal ${updated.name}`,
    });

    return updated;
  }

  async deleteForUser(userId: string, goalId: string): Promise<void> {
    const goal = await this.goals.findOne({ where: { id: goalId, userId } });
    if (!goal) throw new NotFoundException('Financial goal not found');

    await this.goals.remove(goal);

    await this.activityLogs.log({
      userId,
      module: 'financial-goals',
      entity: 'financialGoal',
      entityId: goalId,
      action: 'DELETE',
      label: goal.name,
      details: `Deleted goal ${goal.name}`,
    });
  }
}

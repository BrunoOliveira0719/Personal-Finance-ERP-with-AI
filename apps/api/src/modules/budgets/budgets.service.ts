import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgets: Repository<Budget>,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  listForUser(userId: string): Promise<Budget[]> {
    return this.budgets.find({
      where: { userId },
      order: { periodMonth: 'DESC' },
    });
  }

  async createForUser(userId: string, dto: CreateBudgetDto): Promise<Budget> {
    const created = await this.budgets.save(
      this.budgets.create({
        userId,
        categoryId: dto.categoryId,
        periodMonth: dto.periodMonth,
        amountCents: String(dto.amountCents),
      }),
    );

    await this.activityLogs.log({
      userId,
      module: 'budgets',
      entity: 'budget',
      entityId: created.id,
      action: 'CREATE',
      label: `${created.periodMonth}`,
      details: `Created budget for ${created.periodMonth} totaling ${created.amountCents} cents`,
    });

    return created;
  }

  async updateForUser(userId: string, budgetId: string, dto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.budgets.findOne({ where: { id: budgetId, userId } });
    if (!budget) throw new NotFoundException('Budget not found');

    Object.assign(budget, {
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      ...(dto.periodMonth !== undefined ? { periodMonth: dto.periodMonth } : {}),
      ...(dto.amountCents !== undefined ? { amountCents: String(dto.amountCents) } : {}),
    });

    const updated = await this.budgets.save(budget);

    await this.activityLogs.log({
      userId,
      module: 'budgets',
      entity: 'budget',
      entityId: updated.id,
      action: 'UPDATE',
      label: `${updated.periodMonth}`,
      details: `Updated budget for ${updated.periodMonth}`,
    });

    return updated;
  }

  async deleteForUser(userId: string, budgetId: string): Promise<void> {
    const budget = await this.budgets.findOne({ where: { id: budgetId, userId } });
    if (!budget) throw new NotFoundException('Budget not found');

    await this.budgets.remove(budget);

    await this.activityLogs.log({
      userId,
      module: 'budgets',
      entity: 'budget',
      entityId: budgetId,
      action: 'DELETE',
      label: `${budget.periodMonth}`,
      details: `Deleted budget for ${budget.periodMonth}`,
    });
  }
}

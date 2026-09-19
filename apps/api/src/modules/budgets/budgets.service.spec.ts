import { BudgetsService } from './budgets.service';
import { Budget } from './entities/budget.entity';

describe('BudgetsService', () => {
  const activityLogs = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  it('stores budget amounts as integer cents', async () => {
    const save = jest.fn().mockImplementation(async (budget: Budget) => budget);
    const create = jest.fn().mockImplementation((budget: Budget) => budget);
    const service = new BudgetsService({ create, save } as any, activityLogs as any);

    await service.createForUser('user-1', {
      categoryId: 'category-1',
      periodMonth: '2026-09',
      amountCents: 12500,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        categoryId: 'category-1',
        periodMonth: '2026-09',
        amountCents: '12500',
      }),
    );
  });

  it('updates only owned budgets', async () => {
    const budget = {
      id: 'budget-1',
      userId: 'user-1',
      categoryId: 'category-1',
      periodMonth: '2026-09',
      amountCents: '12500',
    };
    const findOne = jest.fn().mockResolvedValue(budget);
    const save = jest.fn().mockImplementation(async (entity) => entity);
    const service = new BudgetsService({ findOne, save } as any, activityLogs as any);

    await service.updateForUser('user-1', 'budget-1', {
      categoryId: 'category-2',
      periodMonth: '2026-10',
      amountCents: 23000,
    });

    expect(findOne).toHaveBeenCalledWith({ where: { id: 'budget-1', userId: 'user-1' } });
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 'category-2',
        periodMonth: '2026-10',
        amountCents: '23000',
      }),
    );
  });
});

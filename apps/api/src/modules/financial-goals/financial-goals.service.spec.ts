import { FinancialGoalsService } from './financial-goals.service';
import { GoalStatus } from './entities/financial-goal.entity';

describe('FinancialGoalsService', () => {
  const activityLogs = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  it('stores goals as integer cents and tracks progress', async () => {
    const save = jest.fn().mockImplementation(async (goal: any) => goal);
    const create = jest.fn().mockImplementation((goal: any) => goal);
    const service = new FinancialGoalsService({ create, save } as any, activityLogs as any);

    await service.createForUser('user-1', {
      name: 'Emergency fund',
      targetAmountCents: 100000,
      currentAmountCents: 35000,
      targetDate: '2027-12-31',
      status: GoalStatus.ACTIVE,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        name: 'Emergency fund',
        targetAmountCents: '100000',
        currentAmountCents: '35000',
        targetDate: '2027-12-31',
        status: GoalStatus.ACTIVE,
      }),
    );
  });

  it('updates only owned goals', async () => {
    const goal = {
      id: 'goal-1',
      userId: 'user-1',
      name: 'Trip',
      targetAmountCents: '100000',
      currentAmountCents: '50000',
      targetDate: '2027-06-30',
      status: GoalStatus.ACTIVE,
    };
    const findOne = jest.fn().mockResolvedValue(goal);
    const save = jest.fn().mockImplementation(async (entity) => entity);
    const service = new FinancialGoalsService({ findOne, save } as any, activityLogs as any);

    await service.updateForUser('user-1', 'goal-1', {
      name: 'Trip 2027',
      targetAmountCents: 150000,
      currentAmountCents: 75000,
      status: GoalStatus.ACTIVE,
    });

    expect(findOne).toHaveBeenCalledWith({ where: { id: 'goal-1', userId: 'user-1' } });
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Trip 2027',
        targetAmountCents: '150000',
        currentAmountCents: '75000',
      }),
    );
  });
});

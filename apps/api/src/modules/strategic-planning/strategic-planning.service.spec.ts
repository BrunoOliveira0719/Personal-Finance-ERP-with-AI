import { StrategicPlanningService } from './strategic-planning.service';
import { ObjectivePerspective } from './entities/strategic-objective.entity';
import { StrategicPlanStatus } from './entities/strategic-plan.entity';

describe('StrategicPlanningService', () => {
  const activityLogs = { log: jest.fn().mockResolvedValue(undefined) };

  it('creates a plan for the authenticated user', async () => {
    const create = jest.fn((value) => value);
    const save = jest.fn(async (value) => ({ id: 'plan-1', ...value }));
    const service = new StrategicPlanningService(
      { create, save } as any,
      {} as any,
      {} as any,
      activityLogs as any,
    );

    const result = await service.createPlan('user-1', {
      name: 'Financial independence 2030',
      vision: 'Build resilient wealth and freedom of choice.',
      horizonStart: '2026-01-01',
      horizonEnd: '2030-12-31',
      status: StrategicPlanStatus.ACTIVE,
    });

    expect(result).toEqual(expect.objectContaining({ id: 'plan-1', userId: 'user-1' }));
    expect(activityLogs.log).toHaveBeenCalledWith(
      expect.objectContaining({ module: 'strategic-planning', entity: 'strategicPlan' }),
    );
  });

  it('validates objective ownership through the parent plan', async () => {
    const findOne = jest.fn().mockResolvedValue(null);
    const service = new StrategicPlanningService(
      { findOne } as any,
      {} as any,
      {} as any,
      activityLogs as any,
    );

    await expect(
      service.createObjective('user-1', {
        planId: 'plan-1',
        title: 'Build emergency reserve',
        perspective: ObjectivePerspective.SECURITY,
        targetValueCents: 600000,
      }),
    ).rejects.toThrow('Strategic plan not found');
  });
});

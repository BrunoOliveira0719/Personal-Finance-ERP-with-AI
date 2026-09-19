import { Repository } from 'typeorm';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLog } from './activity-log.entity';

describe('ActivityLogsService', () => {
  it('stores a user action and returns recent events first', async () => {
    const logs = [
      {
        id: 'b',
        userId: 'user-1',
        module: 'accounts',
        entity: 'account',
        action: 'DELETE',
        label: 'Conta antiga',
        details: 'Deleted account',
        createdAt: new Date('2024-01-02T00:00:00Z'),
      },
      {
        id: 'a',
        userId: 'user-1',
        module: 'transactions',
        entity: 'transaction',
        action: 'CREATE',
        label: 'Salário',
        details: 'Created transaction',
        createdAt: new Date('2024-01-03T00:00:00Z'),
      },
    ];

    const repo = {
      create: jest.fn((value) => value),
      save: jest.fn(async (value) => value),
      find: jest.fn(async () =>
        [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      ),
    } as unknown as Repository<ActivityLog>;

    const service = new ActivityLogsService(repo);

    await service.log({
      userId: 'user-1',
      module: 'accounts',
      entity: 'account',
      action: 'DELETE',
      label: 'Conta antiga',
      details: 'Deleted account',
      entityId: 'acct-1',
    });

    const result = await service.listForUser('user-1');

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        action: 'DELETE',
        entityId: 'acct-1',
      }),
    );
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Salário');
  });
});

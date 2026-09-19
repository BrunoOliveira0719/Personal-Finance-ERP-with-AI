import { Repository } from 'typeorm';
import { AccountsService } from './accounts.service';
import { Account, AccountType } from './entities/account.entity';

describe('AccountsService', () => {
  it('lists only accounts owned by the authenticated user', async () => {
    const find = jest.fn().mockResolvedValue([]);
    const service = new AccountsService({ find } as unknown as Repository<Account>);

    await service.listForUser('user-1');

    expect(find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      order: { createdAt: 'ASC' },
    });
  });

  it('stores account balances as integer cents', async () => {
    const save = jest.fn().mockImplementation(async (account: Account) => account);
    const create = jest.fn().mockImplementation((account: Account) => account);
    const service = new AccountsService({ create, save } as unknown as Repository<Account>);

    await service.createForUser('user-1', {
      name: 'Checking',
      type: AccountType.CHECKING,
      initialBalanceCents: 12345,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        initialBalanceCents: '12345',
        currency: 'BRL',
      }),
    );
  });
});

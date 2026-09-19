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

  it('updates only owned accounts', async () => {
    const account = { id: 'account-1', userId: 'user-1', name: 'Old', type: AccountType.CHECKING };
    const findOne = jest.fn().mockResolvedValue(account);
    const save = jest.fn().mockImplementation(async (entity) => entity);
    const service = new AccountsService({ findOne, save } as unknown as Repository<Account>);

    await service.updateForUser('user-1', 'account-1', { name: 'New', type: AccountType.SAVINGS });

    expect(findOne).toHaveBeenCalledWith({ where: { id: 'account-1', userId: 'user-1' } });
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New', type: AccountType.SAVINGS }),
    );
  });

  it('deletes only owned accounts', async () => {
    const findOne = jest.fn().mockResolvedValue({ id: 'account-1', userId: 'user-1' });
    const remove = jest.fn().mockResolvedValue(undefined);
    const service = new AccountsService({ findOne, remove } as unknown as Repository<Account>);

    await service.deleteForUser('user-1', 'account-1');

    expect(findOne).toHaveBeenCalledWith({ where: { id: 'account-1', userId: 'user-1' } });
    expect(remove).toHaveBeenCalledWith({ id: 'account-1', userId: 'user-1' });
  });
});

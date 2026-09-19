import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';

describe('TransactionsService', () => {
  const activityLogs = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  it('rejects a transaction for an account owned by another user', async () => {
    const findOne = jest.fn().mockResolvedValue(null);
    const service = new TransactionsService(
      {} as Repository<Transaction>,
      { findOne } as unknown as Repository<Account>,
      activityLogs as any,
    );

    await expect(
      service.createForUser('user-1', {
        accountId: 'account-1',
        type: TransactionType.EXPENSE,
        amountCents: 1000,
        transactionDate: '2026-09-19',
      }),
    ).rejects.toThrow('Account not found');
    expect(findOne).toHaveBeenCalledWith({ where: { id: 'account-1', userId: 'user-1' } });
  });

  it('stores transaction amounts as integer cents', async () => {
    const findOne = jest.fn().mockResolvedValue({ id: 'account-1' });
    const create = jest.fn().mockImplementation((transaction: Transaction) => transaction);
    const save = jest.fn().mockImplementation(async (transaction: Transaction) => transaction);
    const service = new TransactionsService(
      { create, save } as unknown as Repository<Transaction>,
      { findOne } as unknown as Repository<Account>,
      activityLogs as any,
    );

    await service.createForUser('user-1', {
      accountId: 'account-1',
      type: TransactionType.INCOME,
      amountCents: 250000,
      transactionDate: '2026-09-19',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        accountId: 'account-1',
        amountCents: '250000',
      }),
    );
  });
});

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../transactions/entities/transaction.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactions: Repository<Transaction>,
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
  ) {}
  async summary(userId: string, from?: string, to?: string) {
    const rows = await this.transactions.find({
      where: { userId, status: TransactionStatus.POSTED },
      order: { transactionDate: 'ASC' },
    });
    const filtered = rows.filter(
      (row) => (!from || row.transactionDate >= from) && (!to || row.transactionDate <= to),
    );
    const totals = (type: TransactionType) =>
      filtered
        .filter((row) => row.type === type)
        .reduce((sum, row) => sum + Number(row.amountCents), 0);
    return {
      from: from ?? null,
      to: to ?? null,
      incomeCents: totals(TransactionType.INCOME),
      expenseCents: totals(TransactionType.EXPENSE),
      investmentCents: 0,
      netCents: totals(TransactionType.INCOME) - totals(TransactionType.EXPENSE),
      transactionCount: filtered.length,
    };
  }
  async balanceSheet(userId: string) {
    const accounts = await this.accounts.find({ where: { userId } });
    return {
      assets: accounts
        .filter((a) => a.type !== 'CREDIT_CARD')
        .reduce((s, a) => s + Number(a.initialBalanceCents), 0),
      liabilities: accounts
        .filter((a) => a.type === 'CREDIT_CARD')
        .reduce((s, a) => s + Number(a.initialBalanceCents), 0),
    };
  }
}

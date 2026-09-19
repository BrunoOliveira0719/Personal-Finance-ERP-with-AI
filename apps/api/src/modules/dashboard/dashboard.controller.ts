import { Controller, Get, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../transactions/entities/transaction.entity';
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Account) private readonly accounts: Repository<Account>,
    @InjectRepository(Transaction) private readonly transactions: Repository<Transaction>,
  ) {}
  @Get()
  async summary(@Req() req: AuthenticatedRequest) {
    const [accounts, tx] = await Promise.all([
      this.accounts.find({ where: { userId: req.user.id } }),
      this.transactions.find({ where: { userId: req.user.id, status: TransactionStatus.POSTED } }),
    ]);
    const income = tx
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((s, t) => s + Number(t.amountCents), 0);
    const expenses = tx
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((s, t) => s + Number(t.amountCents), 0);
    return {
      revenueCents: income,
      expensesCents: expenses,
      netCents: income - expenses,
      netWorthCents: accounts.reduce((s, a) => s + Number(a.initialBalanceCents), 0),
      breakEvenCents: expenses,
    };
  }
}

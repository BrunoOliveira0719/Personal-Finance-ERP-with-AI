import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
  ) {}

  listForUser(userId: string, accountId?: string): Promise<Transaction[]> {
    return this.transactions.find({
      where: { userId, ...(accountId ? { accountId } : {}) },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async createForUser(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const account = await this.accounts.findOne({ where: { id: dto.accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');

    const transaction = this.transactions.create({
      ...dto,
      userId,
      categoryId: dto.categoryId ?? null,
      costCenterId: dto.costCenterId ?? null,
      description: dto.description ?? null,
      status: dto.status ?? TransactionStatus.POSTED,
      transferPairId: dto.transferPairId ?? null,
      amountCents: String(dto.amountCents),
    });
    return this.transactions.save(transaction);
  }
}

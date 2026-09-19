import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accounts/entities/account.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactions: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  listForUser(userId: string, accountId?: string): Promise<Transaction[]> {
    return this.transactions.find({
      where: { userId, ...(accountId ? { accountId } : {}) },
      order: { transactionDate: 'DESC', createdAt: 'DESC' },
    });
  }

  private async validateAccountAccess(userId: string, accountId: string) {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async createForUser(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    await this.validateAccountAccess(userId, dto.accountId);

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
    const saved = await this.transactions.save(transaction);
    await this.activityLogs.log({
      userId,
      module: 'transactions',
      entity: 'transaction',
      entityId: saved.id,
      action: 'CREATE',
      label: saved.description ?? saved.type,
      details: `${saved.type} transaction registered`,
    });
    return saved;
  }

  async updateForUser(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactions.findOne({ where: { id: transactionId, userId } });
    if (!transaction) throw new NotFoundException('Transaction not found');

    if (dto.accountId !== undefined) {
      await this.validateAccountAccess(userId, dto.accountId);
    }

    const previousLabel = transaction.description ?? transaction.type;
    Object.assign(transaction, {
      ...(dto.accountId !== undefined ? { accountId: dto.accountId } : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId ?? null } : {}),
      ...(dto.costCenterId !== undefined ? { costCenterId: dto.costCenterId ?? null } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.amountCents !== undefined ? { amountCents: String(dto.amountCents) } : {}),
      ...(dto.description !== undefined ? { description: dto.description ?? null } : {}),
      ...(dto.transactionDate !== undefined ? { transactionDate: dto.transactionDate } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.transferPairId !== undefined ? { transferPairId: dto.transferPairId ?? null } : {}),
    });

    const updated = await this.transactions.save(transaction);
    await this.activityLogs.log({
      userId,
      module: 'transactions',
      entity: 'transaction',
      entityId: updated.id,
      action: 'UPDATE',
      label: updated.description ?? updated.type,
      details: `Updated transaction ${previousLabel}`,
    });
    return updated;
  }

  async deleteForUser(userId: string, transactionId: string): Promise<void> {
    const transaction = await this.transactions.findOne({ where: { id: transactionId, userId } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    await this.transactions.remove(transaction);
    await this.activityLogs.log({
      userId,
      module: 'transactions',
      entity: 'transaction',
      entityId: transactionId,
      action: 'DELETE',
      label: transaction.description ?? transaction.type,
      details: `Deleted transaction ${transaction.description ?? transaction.type}`,
    });
  }
}

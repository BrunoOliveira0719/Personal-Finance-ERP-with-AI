import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  listForUser(userId: string): Promise<Account[]> {
    return this.accounts.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async createForUser(userId: string, dto: CreateAccountDto): Promise<Account> {
    const account = this.accounts.create({
      ...dto,
      userId,
      institution: dto.institution ?? null,
      initialBalanceCents: String(dto.initialBalanceCents),
      currency: dto.currency?.toUpperCase() ?? 'BRL',
    });
    const saved = await this.accounts.save(account);
    await this.activityLogs.log({
      userId,
      module: 'accounts',
      entity: 'account',
      entityId: saved.id,
      action: 'CREATE',
      label: saved.name,
      details: `Created account ${saved.name}`,
    });
    return saved;
  }

  async findForUser(userId: string, accountId: string): Promise<Account> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateForUser(userId: string, accountId: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');

    const previousName = account.name;
    Object.assign(account, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.institution !== undefined ? { institution: dto.institution ?? null } : {}),
      ...(dto.initialBalanceCents !== undefined
        ? { initialBalanceCents: String(dto.initialBalanceCents) }
        : {}),
      ...(dto.currency !== undefined ? { currency: dto.currency.toUpperCase() } : {}),
    });

    const updated = await this.accounts.save(account);
    await this.activityLogs.log({
      userId,
      module: 'accounts',
      entity: 'account',
      entityId: updated.id,
      action: 'UPDATE',
      label: updated.name,
      details: `Updated account ${previousName} to ${updated.name}`,
    });
    return updated;
  }

  async deleteForUser(userId: string, accountId: string): Promise<void> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');
    await this.accounts.remove(account);
    await this.activityLogs.log({
      userId,
      module: 'accounts',
      entity: 'account',
      entityId: accountId,
      action: 'DELETE',
      label: account.name,
      details: `Deleted account ${account.name}`,
    });
  }
}

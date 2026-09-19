import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
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
    return this.accounts.save(account);
  }

  async findForUser(userId: string, accountId: string): Promise<Account> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateForUser(userId: string, accountId: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');

    Object.assign(account, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.institution !== undefined ? { institution: dto.institution ?? null } : {}),
      ...(dto.initialBalanceCents !== undefined
        ? { initialBalanceCents: String(dto.initialBalanceCents) }
        : {}),
      ...(dto.currency !== undefined ? { currency: dto.currency.toUpperCase() } : {}),
    });

    return this.accounts.save(account);
  }

  async deleteForUser(userId: string, accountId: string): Promise<void> {
    const account = await this.accounts.findOne({ where: { id: accountId, userId } });
    if (!account) throw new NotFoundException('Account not found');
    await this.accounts.remove(account);
  }
}

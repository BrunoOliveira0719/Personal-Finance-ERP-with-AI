import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest, @Query('accountId') accountId?: string) {
    return this.transactionsService.listForUser(request.user.id, accountId);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.createForUser(request.user.id, dto);
  }
}

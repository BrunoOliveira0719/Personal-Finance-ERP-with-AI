import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateForUser(request.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.transactionsService.deleteForUser(request.user.id, id);
  }
}

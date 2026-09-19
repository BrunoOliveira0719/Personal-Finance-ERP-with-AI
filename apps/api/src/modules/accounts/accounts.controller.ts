import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.accountsService.listForUser(request.user.id);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateAccountDto) {
    return this.accountsService.createForUser(request.user.id, dto);
  }

  @Get(':id')
  find(@Req() request: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.findForUser(request.user.id, id);
  }
}

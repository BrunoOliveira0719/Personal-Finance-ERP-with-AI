import { Controller, Get, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly service: ActivityLogsService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.service.listForUser(req.user.id);
  }
}

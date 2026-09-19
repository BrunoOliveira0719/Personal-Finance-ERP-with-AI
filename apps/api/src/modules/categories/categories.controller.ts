import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.service.listForUser(req.user.id);
  }
  @Post() create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCategoryDto) {
    return this.service.createForUser(req.user.id, dto);
  }
}

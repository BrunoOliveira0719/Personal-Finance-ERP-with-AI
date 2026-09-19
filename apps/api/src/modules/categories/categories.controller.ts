import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/session-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}
  @Get() list(@Req() req: AuthenticatedRequest) {
    return this.service.listForUser(req.user.id);
  }
  @Post() create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCategoryDto) {
    return this.service.createForUser(req.user.id, dto);
  }
  @Patch(':id') update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.updateForUser(req.user.id, id, dto);
  }
  @Delete(':id') remove(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.deleteForUser(req.user.id, id);
  }
}

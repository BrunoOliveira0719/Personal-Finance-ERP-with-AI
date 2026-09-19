import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    private readonly activityLogs: ActivityLogsService,
  ) {}
  listForUser(userId: string) {
    return this.categories.find({
      where: [{ userId }, { isSystem: true }],
      order: { name: 'ASC' },
    });
  }
  async createForUser(userId: string, dto: CreateCategoryDto) {
    const created = await this.categories.save(
      this.categories.create({ ...dto, userId, parentId: dto.parentId ?? null, isSystem: false }),
    );
    await this.activityLogs.log({
      userId,
      module: 'categories',
      entity: 'category',
      entityId: created.id,
      action: 'CREATE',
      label: created.name,
      details: `Created category ${created.name}`,
    });
    return created;
  }

  async updateForUser(userId: string, categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.categories.findOne({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException('Category not found');

    const previousName = category.name;
    Object.assign(category, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.parentId !== undefined ? { parentId: dto.parentId ?? null } : {}),
    });

    const updated = await this.categories.save(category);
    await this.activityLogs.log({
      userId,
      module: 'categories',
      entity: 'category',
      entityId: updated.id,
      action: 'UPDATE',
      label: updated.name,
      details: `Updated category ${previousName}`,
    });
    return updated;
  }

  async deleteForUser(userId: string, categoryId: string) {
    const category = await this.categories.findOne({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categories.remove(category);
    await this.activityLogs.log({
      userId,
      module: 'categories',
      entity: 'category',
      entityId: categoryId,
      action: 'DELETE',
      label: category.name,
      details: `Deleted category ${category.name}`,
    });
  }
}

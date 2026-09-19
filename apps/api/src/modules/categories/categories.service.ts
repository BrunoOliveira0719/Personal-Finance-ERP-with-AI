import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categories: Repository<Category>) {}
  listForUser(userId: string) {
    return this.categories.find({
      where: [{ userId }, { isSystem: true }],
      order: { name: 'ASC' },
    });
  }
  createForUser(userId: string, dto: CreateCategoryDto) {
    return this.categories.save(
      this.categories.create({ ...dto, userId, parentId: dto.parentId ?? null, isSystem: false }),
    );
  }

  async updateForUser(userId: string, categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.categories.findOne({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException('Category not found');

    Object.assign(category, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.parentId !== undefined ? { parentId: dto.parentId ?? null } : {}),
    });

    return this.categories.save(category);
  }

  async deleteForUser(userId: string, categoryId: string) {
    const category = await this.categories.findOne({ where: { id: categoryId, userId } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categories.remove(category);
  }
}

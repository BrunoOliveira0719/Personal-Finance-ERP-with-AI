import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
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
}

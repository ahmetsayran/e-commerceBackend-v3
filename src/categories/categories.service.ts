import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Slug already in use');
    }
    return this.prisma.category.create({ data: dto });
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findById(id);

    if (dto.slug) {
      const conflict = await this.prisma.category.findFirst({
        where: { id: { not: id }, slug: dto.slug },
      });
      if (conflict) {
        throw new ConflictException('Slug already in use');
      }
    }

    return this.prisma.category.update({
      where: { id: category.id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findById(id);
    try {
      await this.prisma.category.delete({ where: { id } });
    } catch {
      throw new ConflictException(
        'Category cannot be deleted while products reference it',
      );
    }
  }
}

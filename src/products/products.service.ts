import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

const SORT_FIELDS: Record<string, string> = {
  price: 'price',
  rating: 'averageRating',
  created_at: 'createdAt',
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  findAll(filter: FilterProductsDto = new FilterProductsDto()) {
    const where: Prisma.ProductWhereInput = {
      categoryId: filter.categoryId,
      price: {
        gte: filter.minPrice,
        lte: filter.maxPrice,
      },
      averageRating: filter.minRating ? { gte: filter.minRating } : undefined,
    };

    return this.prisma.product.findMany({
      where,
      orderBy: this.parseSort(filter.sort),
    });
  }

  private parseSort(sort?: string): Prisma.ProductOrderByWithRelationInput {
    if (!sort) {
      return { createdAt: 'desc' };
    }

    const [field, direction] = sort.split(':');
    const orderField = SORT_FIELDS[field];
    if (!orderField || (direction !== 'asc' && direction !== 'desc')) {
      throw new BadRequestException(`Invalid sort value: ${sort}`);
    }

    if (orderField === 'averageRating') {
      return { averageRating: { sort: direction, nulls: 'last' } };
    }

    return { [orderField]: direction };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prisma.product.delete({ where: { id } });
  }
}

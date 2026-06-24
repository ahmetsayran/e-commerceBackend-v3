import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stockQuantity === 0) {
      throw new BadRequestException('Product is out of stock');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId: dto.productId } },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  findAllForUser(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async findOwnedById(userId: number, id: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }
    return item;
  }

  async update(userId: number, id: number, dto: UpdateCartItemDto) {
    await this.findOwnedById(userId, id);
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: dto.quantity },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOwnedById(userId, id);
    await this.prisma.cartItem.delete({ where: { id } });
  }

  async clear(userId: number) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}

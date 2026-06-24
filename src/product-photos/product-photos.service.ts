import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';

@Injectable()
export class ProductPhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductPhotoDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.productPhoto.count({
        where: { productId: dto.productId },
      });
      const lastPhoto = await tx.productPhoto.findFirst({
        where: { productId: dto.productId },
        orderBy: { order: 'desc' },
      });
      const nextOrder = (lastPhoto?.order ?? 0) + 1;
      const isPrimary = existingCount === 0;

      const photo = await tx.productPhoto.create({
        data: {
          productId: dto.productId,
          url: dto.url,
          size: dto.size,
          order: nextOrder,
          isPrimary,
        },
      });

      if (isPrimary) {
        await tx.product.update({
          where: { id: dto.productId },
          data: { primaryPhotoUrl: dto.url },
        });
      }

      return photo;
    });
  }

  async remove(id: number) {
    await this.prisma.$transaction(async (tx) => {
      const photo = await tx.productPhoto.findUnique({ where: { id } });
      if (!photo) {
        throw new NotFoundException('Product photo not found');
      }

      await tx.productPhoto.delete({ where: { id } });

      await tx.productPhoto.updateMany({
        where: { productId: photo.productId, order: { gt: photo.order } },
        data: { order: { decrement: 1 } },
      });

      if (photo.isPrimary) {
        const nextPrimary = await tx.productPhoto.findFirst({
          where: { productId: photo.productId },
          orderBy: { order: 'asc' },
        });

        await tx.product.update({
          where: { id: photo.productId },
          data: { primaryPhotoUrl: nextPrimary?.url ?? null },
        });

        if (nextPrimary) {
          await tx.productPhoto.update({
            where: { id: nextPrimary.id },
            data: { isPrimary: true },
          });
        }
      }
    });
  }
}

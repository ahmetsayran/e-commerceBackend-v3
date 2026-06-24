import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';

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

  async update(id: number, dto: UpdateProductPhotoDto) {
    return this.prisma.$transaction(async (tx) => {
      const photo = await tx.productPhoto.findUnique({ where: { id } });
      if (!photo) {
        throw new NotFoundException('Product photo not found');
      }

      if (dto.order !== undefined && dto.order !== photo.order) {
        const totalCount = await tx.productPhoto.count({
          where: { productId: photo.productId },
        });
        const targetOrder = Math.min(Math.max(dto.order, 1), totalCount);

        await tx.productPhoto.update({ where: { id }, data: { order: -1 } });

        if (targetOrder > photo.order) {
          const affected = await tx.productPhoto.findMany({
            where: {
              productId: photo.productId,
              order: { gt: photo.order, lte: targetOrder },
            },
            orderBy: { order: 'asc' },
          });
          for (const p of affected) {
            await tx.productPhoto.update({
              where: { id: p.id },
              data: { order: p.order - 1 },
            });
          }
        } else {
          const affected = await tx.productPhoto.findMany({
            where: {
              productId: photo.productId,
              order: { gte: targetOrder, lt: photo.order },
            },
            orderBy: { order: 'desc' },
          });
          for (const p of affected) {
            await tx.productPhoto.update({
              where: { id: p.id },
              data: { order: p.order + 1 },
            });
          }
        }

        await tx.productPhoto.update({
          where: { id },
          data: { order: targetOrder },
        });
      }

      if (dto.isPrimary === true && !photo.isPrimary) {
        await tx.productPhoto.updateMany({
          where: { productId: photo.productId, isPrimary: true },
          data: { isPrimary: false },
        });
        await tx.productPhoto.update({
          where: { id },
          data: { isPrimary: true },
        });
        await tx.product.update({
          where: { id: photo.productId },
          data: { primaryPhotoUrl: photo.url },
        });
      } else if (dto.isPrimary === false) {
        await tx.productPhoto.update({
          where: { id },
          data: { isPrimary: false },
        });
      }

      return tx.productPhoto.findUnique({ where: { id } });
    });
  }

  async remove(id: number) {
    await this.prisma.$transaction(async (tx) => {
      const photo = await tx.productPhoto.findUnique({ where: { id } });
      if (!photo) {
        throw new NotFoundException('Product photo not found');
      }

      await tx.productPhoto.delete({ where: { id } });

      const affected = await tx.productPhoto.findMany({
        where: { productId: photo.productId, order: { gt: photo.order } },
        orderBy: { order: 'asc' },
      });
      for (const p of affected) {
        await tx.productPhoto.update({
          where: { id: p.id },
          data: { order: p.order - 1 },
        });
      }

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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCommentDto) {
    if (dto.content && !dto.title) {
      throw new BadRequestException('title is required when content is set');
    }

    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.productComment.create({
        data: {
          userId,
          productId: dto.productId,
          title: dto.title,
          content: dto.content,
          rating: dto.rating,
        },
      });

      await this.syncProductRatingStats(tx, dto.productId);

      return comment;
    });
  }

  findAll(filter: FilterCommentsDto) {
    return this.prisma.productComment.findMany({
      where: {
        productId: filter.productId,
        rating: filter.rating,
      },
    });
  }

  async findById(id: number) {
    const comment = await this.prisma.productComment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: number, dto: UpdateCommentDto) {
    const existing = await this.findById(id);
    const title = dto.title ?? existing.title;
    const content = dto.content ?? existing.content;

    if (content && !title) {
      throw new BadRequestException('title is required when content is set');
    }

    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.productComment.update({
        where: { id },
        data: {
          title,
          content,
          rating: dto.rating ?? existing.rating,
        },
      });

      if (dto.rating !== undefined) {
        await this.syncProductRatingStats(tx, existing.productId);
      }

      return comment;
    });
  }

  async remove(id: number) {
    const existing = await this.findById(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.productComment.delete({ where: { id } });
      await this.syncProductRatingStats(tx, existing.productId);
    });
  }

  private async syncProductRatingStats(
    tx: Prisma.TransactionClient,
    productId: number,
  ) {
    const stats = await tx.productComment.aggregate({
      where: { productId },
      _count: true,
      _avg: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        commentCount: stats._count,
        averageRating: stats._avg.rating,
      },
    });
  }
}

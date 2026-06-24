import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { PublicUser } from '../users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  create(@Req() request: Request, @Body() dto: CreateCartItemDto) {
    const user = request.user as PublicUser;
    return this.cartItemsService.create(user.id, dto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.cartItemsService.findAllForUser(user.id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const user = request.user as PublicUser;
    return this.cartItemsService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as PublicUser;
    return this.cartItemsService.remove(user.id, id);
  }

  @Delete()
  clear(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.cartItemsService.clear(user.id);
  }
}

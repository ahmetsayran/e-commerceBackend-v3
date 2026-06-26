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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import type { PublicUser } from '../users/users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @RequirePermission(PERMISSIONS.CARTS.UPDATE_OWN)
  create(@Req() request: Request, @Body() dto: CreateCartItemDto) {
    const user = request.user as PublicUser;
    return this.cartItemsService.create(user.id, dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.CARTS.READ_OWN)
  findAll(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.cartItemsService.findAllForUser(user.id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.CARTS.UPDATE_OWN)
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const user = request.user as PublicUser;
    return this.cartItemsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.CARTS.UPDATE_OWN)
  remove(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as PublicUser;
    return this.cartItemsService.remove(user.id, id);
  }

  @Delete()
  @RequirePermission(PERMISSIONS.CARTS.UPDATE_OWN)
  clear(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.cartItemsService.clear(user.id);
  }
}

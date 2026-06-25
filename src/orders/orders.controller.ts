import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { PublicUser } from '../users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.ordersService.create(user.id);
  }

  @Get()
  findAll(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.ordersService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as PublicUser;
    return this.ordersService.findOwnedById(user.id, id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    const user = request.user as PublicUser;
    return this.ordersService.update(user.id, id, dto);
  }
}

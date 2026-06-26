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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import type { PublicUser } from '../users/users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @RequirePermission(PERMISSIONS.ORDERS.CREATE)
  create(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.ordersService.create(user.id);
  }

  @Get()
  @RequirePermission(PERMISSIONS.ORDERS.READ_OWN)
  findAll(@Req() request: Request) {
    const user = request.user as PublicUser;
    return this.ordersService.findAllForUser(user.id);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ORDERS.READ_OWN)
  findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    const user = request.user as PublicUser;
    return this.ordersService.findOwnedById(user.id, id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.ORDERS.UPDATE_OWN)
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ) {
    const user = request.user as PublicUser;
    return this.ordersService.update(user.id, id, dto);
  }
}

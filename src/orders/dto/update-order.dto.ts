import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../../generated/prisma';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

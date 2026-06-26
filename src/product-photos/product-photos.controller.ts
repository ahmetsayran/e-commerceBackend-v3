import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import { ProductPhotosService } from './product-photos.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('product-photos')
export class ProductPhotosController {
  constructor(private readonly productPhotosService: ProductPhotosService) {}

  @Post()
  @RequirePermission(PERMISSIONS.PRODUCT_PHOTOS.CREATE)
  create(@Body() dto: CreateProductPhotoDto) {
    return this.productPhotosService.create(dto);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.PRODUCT_PHOTOS.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductPhotoDto,
  ) {
    return this.productPhotosService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.PRODUCT_PHOTOS.DELETE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productPhotosService.remove(id);
  }
}

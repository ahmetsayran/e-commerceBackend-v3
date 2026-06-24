import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import { CreateProductPhotoDto } from './dto/create-product-photo.dto';
import { UpdateProductPhotoDto } from './dto/update-product-photo.dto';

@Controller('product-photos')
export class ProductPhotosController {
  constructor(private readonly productPhotosService: ProductPhotosService) {}

  @Post()
  create(@Body() dto: CreateProductPhotoDto) {
    return this.productPhotosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductPhotoDto,
  ) {
    return this.productPhotosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productPhotosService.remove(id);
  }
}

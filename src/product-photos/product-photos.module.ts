import { Module } from '@nestjs/common';
import { ProductPhotosService } from './product-photos.service';
import { ProductPhotosController } from './product-photos.controller';

@Module({
  providers: [ProductPhotosService],
  controllers: [ProductPhotosController],
})
export class ProductPhotosModule {}

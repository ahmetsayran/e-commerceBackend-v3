import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @RequirePermission(PERMISSIONS.CATEGORIES.CREATE)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.CATEGORIES.READ)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.CATEGORIES.READ)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.CATEGORIES.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.CATEGORIES.DELETE)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}

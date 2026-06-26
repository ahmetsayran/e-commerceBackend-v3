import {
  Body,
  Controller,
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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission(PERMISSIONS.ROLES.CREATE)
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.ROLES.READ)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.ROLES.READ)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findById(id);
  }

  @Patch(':id/permissions')
  @RequirePermission(PERMISSIONS.ROLES.UPDATE)
  updatePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissions(id, dto);
  }
}

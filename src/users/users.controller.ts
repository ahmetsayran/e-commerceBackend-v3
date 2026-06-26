import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission(PERMISSIONS.USERS.READ_ANY)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.USERS.READ_OWN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.USERS.UPDATE_OWN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Get(':id/roles')
  @RequirePermission(PERMISSIONS.USERS.READ_OWN)
  findRoles(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserRoles(id);
  }

  @Post(':id/roles')
  @RequirePermission(PERMISSIONS.USERS.UPDATE_ANY)
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.usersService.assignRole(id, dto);
  }

  @Delete(':id/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(PERMISSIONS.USERS.UPDATE_ANY)
  removeRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.usersService.removeRole(id, roleId);
  }
}

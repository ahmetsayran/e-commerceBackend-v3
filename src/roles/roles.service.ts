import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Role already exists');
    }
    return this.prisma.role.create({ data: { name: dto.name } });
  }

  findAll() {
    return this.prisma.role.findMany({ include: { permissions: true } });
  }

  async findById(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updatePermissions(id: number, dto: UpdateRolePermissionsDto) {
    await this.findById(id);
    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await this.prisma.rolePermission.createMany({
      data: dto.permissions.map((key) => ({ roleId: id, permissionKey: key })),
    });
    return this.findById(id);
  }
}

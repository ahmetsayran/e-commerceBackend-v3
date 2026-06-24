import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const PUBLIC_USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  fullName: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });
    if (existing) {
      throw new ConflictException('Username or email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        fullName: `${dto.firstName} ${dto.lastName}`,
        username: dto.username,
        email: dto.email,
        passwordHash,
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({ select: PUBLIC_USER_SELECT });
  }

  async findById(id: number): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uniqueChecks = [
      ...(dto.username ? [{ username: dto.username }] : []),
      ...(dto.email ? [{ email: dto.email }] : []),
    ];
    if (uniqueChecks.length > 0) {
      const conflict = await this.prisma.user.findFirst({
        where: { id: { not: id }, OR: uniqueChecks },
      });
      if (conflict) {
        throw new ConflictException('Username or email already in use');
      }
    }

    const firstName = dto.firstName ?? user.firstName;
    const lastName = dto.lastName ?? user.lastName;

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        username: dto.username ?? user.username,
        email: dto.email ?? user.email,
      },
      select: PUBLIC_USER_SELECT,
    });
  }
}

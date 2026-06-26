import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PERMISSIONS } from '../common/constants/permissions';
import type { PublicUser } from '../users/users.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @RequirePermission(PERMISSIONS.COMMENTS.CREATE)
  create(@Req() request: Request, @Body() dto: CreateCommentDto) {
    const user = request.user as PublicUser;
    return this.commentsService.create(user.id, dto);
  }

  @Get()
  @RequirePermission(PERMISSIONS.COMMENTS.READ)
  findAll(@Query() filter: FilterCommentsDto) {
    return this.commentsService.findAll(filter);
  }

  @Get(':id')
  @RequirePermission(PERMISSIONS.COMMENTS.READ)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findById(id);
  }

  @Patch(':id')
  @RequirePermission(PERMISSIONS.COMMENTS.UPDATE_OWN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission(PERMISSIONS.COMMENTS.DELETE_OWN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

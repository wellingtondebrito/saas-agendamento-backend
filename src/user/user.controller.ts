// src/user/user.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard'; // <-- Novo
import { Roles } from 'src/auth/decorator/roles.decorator'; // <-- Novo
import { TipoUsuario } from '@prisma/client';
import { UserService } from './user.service';
import { UserResponseDto, UserUpdateDto } from './dto/user.dto';

@Controller('users')
// Use os guards na ordem:
// 1. AuthGuard garante o token e anexa 'user' à req.
// 2. RolesGuard usa req.user para verificar a permissão.
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(TipoUsuario.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatedUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
  ) {
    const updated = await this.userService.userUpdate(id, dto);
    return {
      message: 'Usuário atualizado com sucesso!',
      data: updated,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}

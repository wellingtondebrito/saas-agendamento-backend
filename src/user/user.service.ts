import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto, UserUpdateDto } from './dto/user.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        avatarUrl: true,
        contato: true,
        endereco: true,
      },
    });

    const userDto = users.map((user) => {
      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        avatar: user.avatarUrl,
        contato: user.contato as any,
        endereco: user.endereco as any,
      } as UserResponseDto;
    });

    return userDto;
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        avatarUrl: true,
        contato: true,
        endereco: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      avatarUrl: user.avatarUrl,
      contato: user.contato as any,
      endereco: user.endereco as any,
    } as UserResponseDto;
  }

  async userUpdate(
    idUser: number,
    userDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    const data: any = {
      ...userDto,
    };

    if (userDto.contato) {
      data.contato = instanceToPlain(userDto.contato);
    }
    if (userDto.endereco) {
      data.endereco = instanceToPlain(userDto.endereco);
    }
    try {
      const user = await this.prisma.usuario.update({
        where: { id: idUser },
        data: data,
        select: {
          id: true,
          nome: true,
          email: true,
          avatarUrl: true,
          contato: true,
          endereco: true,
          tipo: true,
        },
      });
      return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        avatarUrl: user.avatarUrl,
        contato: user.contato as any,
        endereco: user.endereco as any,
        tipo: user.tipo,
      } as UserResponseDto;
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Usuário com ID ${idUser} não encontrado.`);
      }
      throw e;
    }
  }

  async deleteUser(idUser: number): Promise<void> {
    try {
      await this.prisma.usuario.delete({
        where: { id: idUser },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Usuário com Id ${idUser} não encontrad0.`);
      }
      throw e;
    }
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoUsuario } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { Type, instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    const contatoJson = instanceToPlain(dto.contato);
    const enderecoJson = instanceToPlain(dto.endereco);

    try {
      const user = await this.prisma.usuario.create({
        data: {
          email: dto.email,
          senhaHash: hash,
          nome: dto.nome,
          contato: contatoJson,
          endereco: enderecoJson,
          tipo: TipoUsuario.CLIENTE,
          cliente: {
            create: {},
          },
        },
      });

      const { senhaHash, ...userWithoutHash } = user;
      return userWithoutHash;
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ForbiddenException('Este e-mail já está em uso.');
      }
      throw e;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    const correctPassword = await argon.verify(user.senhaHash, dto.password);

    if (!correctPassword) {
      throw new ForbiddenException(
        'Senha incorreta! Por favor verifique e tente novamente.',
      );
    }

    return this.signToken(user.id, user.email, user.tipo);
  }

  async signToken(
    userId: number,
    email: string,
    tipo: TipoUsuario,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      tipo,
    };
    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
    };
  }
}

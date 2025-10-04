// src/auth/strategy/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Para acessar o .env
import { PrismaService } from 'src/prisma/prisma.service'; // Para buscar o usuário

// Definição do Payload (o que está dentro do token)
// Importe TipoUsuario se necessário ou defina um tipo simples
type JwtPayload = {
  sub: number; // O ID do usuário (subject)
  email: string;
  tipo: 'ADMIN' | 'COLABORADOR' | 'CLIENTE'; // Tipagem do enum
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.getOrThrow<string>('JWT_SECRET');
    super({
      // 1. Onde buscar o token: do cabeçalho 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Ignorar expiração: false (devemos verificar a expiração)
      ignoreExpiration: false,
      // 3. Chave secreta para verificação
      secretOrKey: secret,
    });
  }

  // O método 'validate' é chamado após a validação do token
  async validate(payload: JwtPayload) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!usuario) {
      return null;
    }

    // CORREÇÃO: Usar destructuring para separar o hash do resto do objeto
    const { senhaHash, ...usuarioSemHash } = usuario;

    // Retorna a cópia do objeto SEM o hash da senha
    return usuarioSemHash;
  }
}

// src/auth/auth.module.ts (Versão Corrigida e Segura)

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- NOVO: Para acessar o .env

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      // CORRIGIDO: Tipamos explicitamente o parâmetro como ConfigService para evitar problemas de tipagem.
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      // Linha 24 permanece correta
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // O AuthModule também precisa exportar o JwtService para que as estratégias possam usá-lo.
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}

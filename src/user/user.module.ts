// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Para que o UserService possa usar o Prisma
import { AuthModule } from 'src/auth/auth.module'; // Importa contexto de Guards/Estratégia

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserService], // O service precisa ser criado
})
export class UserModule {}

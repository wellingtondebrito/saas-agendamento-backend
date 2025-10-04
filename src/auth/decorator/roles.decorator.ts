import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';

export const ROLES_KEY = 'roles';
// Cria um decorador customizado para definir as permissões necessárias na rota
export const Roles = (...roles: TipoUsuario[]) => SetMetadata(ROLES_KEY, roles);

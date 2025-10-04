import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Para ler o @SetMetadata
import { TipoUsuario } from '@prisma/client';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Tenta ler as permissões requeridas da rota
    const requiredRoles = this.reflector.getAllAndOverride<TipoUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se a rota não tiver o decorador @Roles, permite o acesso
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtém o usuário do objeto de requisição
    const { user } = context.switchToHttp().getRequest();

    // 3. Verifica se o tipo do usuário está na lista de tipos permitidos
    // 'user.tipo' é do tipo TipoUsuario, que é retornado pelo JwtStrategy
    return requiredRoles.some((role) => user.tipo === role);
  }
}

// roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Você não possui um token de acesso!');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'dr6XXiu71Zq4&gO7KejpHNabp',
      });
      const isAdminRequired = this.reflector.get<boolean>(
        'isAdmin',
        context.getHandler(),
      );
      const isAdmin = decoded.admin || false;

      if (isAdminRequired && !isAdmin) {
        throw new UnauthorizedException(
          'Acesso não autorizado! Você não é um administrador.',
        );
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido, acesso não autorizado!');
    }
  }
}

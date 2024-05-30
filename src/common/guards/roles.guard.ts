import {
  CanActivate,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const roles = this.reflector.get<string[]>('role', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const accessToken = authHeader.split(' ')[1];

      try {
        const user = this.jwtService.verify(accessToken, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        });

        const hasRole = () => roles.some((role) => user.role === role);

        return user && user.role && hasRole();
      } catch (err) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
    } catch (err) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}

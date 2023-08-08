import {
  Controller,
  Get,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { RolesGuard } from './Auth/admin/admin.guard';
import { Admin } from './Auth/admin/admin.decorator';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Admin(false)
  @UseGuards(RolesGuard)
  @Get('validate-token')
  async validateToken(@Headers('authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Token não fornecido ou no formato inválido.',
      );
    }
    const token = authorization.split(' ')[1];
    const decodedToken = await this.jwtService.verifyAsync(token, {
      secret: 'dr6XXiu71Zq4&gO7KejpHNabp',
    });
    const user = await this.usersService.findByEmail(decodedToken.email);
    return { id: user.id, admin: user.admin };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

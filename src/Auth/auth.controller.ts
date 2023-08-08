import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(userLoginDto);
    if (!user) {
      throw new UnauthorizedException('Usuário inválido');
    }
    const token = await this.authService.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      picture: user.profilePic,
      admin: user.admin,
    });
    delete user.encryptedPassword;
    return { token };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { User } from '../users/entities/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  async validateUser({ email, password }: UserLoginDto): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.encryptedPassword) {
      const passSuccess = await compare(password, user.encryptedPassword);
      if (passSuccess) {
        return user;
      }
    }
    throw new UnauthorizedException('Email ou senha inválido');
  }
}

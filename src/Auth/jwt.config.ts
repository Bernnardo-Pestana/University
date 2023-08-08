import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtconfig: JwtModuleOptions = {
  secret: 'dr6XXiu71Zq4&gO7KejpHNabp',
  signOptions: { expiresIn: '1d' },
};

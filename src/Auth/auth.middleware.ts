/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authservice: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token && (await verifyToken(token, this.authservice))) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}

async function verifyToken(token: string, authservice: AuthService) {
  try {
    const decoded = await authservice.validateToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

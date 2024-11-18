import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    let tokenArray: string[];
    if (req.headers['authorization']) {
      tokenArray = req.headers['authorization'].split(' ');
    } else {
      throw new BadRequestException('JWT token required');
    }
    const accessToken = tokenArray[1];
    if (!accessToken) {
      throw new BadRequestException('JWT token required');
    }

    try {
      const decodedToken: any = jwt.verify(accessToken, 'JwtSecret');

      const currentTime = Math.floor(Date.now() / 1000);
      console.log('Middleware');

      if (decodedToken.exp < currentTime) {
        throw new UnauthorizedException('Token has expired');
      }
      if (decodedToken) {
        next();
      } else {
        throw new UnauthorizedException('User Not logged In');
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('User not logged in');
      }
    }
  }
}

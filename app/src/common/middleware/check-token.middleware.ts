import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ErrorMsg } from 'src/utility/custom-msg';

@Injectable()
export class CheckTokenMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    let tokenArray: string[];
    if (req.headers['authorization']) {
      tokenArray = req.headers['authorization'].split(' ');
    } else {
      throw new BadRequestException(ErrorMsg.TOKEN_REQUIRED);
    }
    const accessToken = tokenArray[1];
    if (!accessToken) {
      throw new BadRequestException(ErrorMsg.TOKEN_REQUIRED);
    }

    try {
      const decodedToken: any = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = {
        id: decodedToken._id,
        email: decodedToken.email,
        name: decodedToken.name,
      };
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        throw new UnauthorizedException(ErrorMsg.TOKEN_EXPIRED);
      }
      if (decodedToken) {
        next();
      } else {
        throw new UnauthorizedException(ErrorMsg.UNATHORIZED_USER);
      }
    } catch (error) {
      if (error.name === ErrorMsg.TOKEN_EXPIRED_ERROR) {
        throw new UnauthorizedException(ErrorMsg.TOKEN_EXPIRED);
      } else if (error.name === ErrorMsg.JSON_WEB_TOKEN_ERROR) {
        throw new UnauthorizedException(ErrorMsg.TOKEN_INVALID);
      } else {
        throw new UnauthorizedException(ErrorMsg.TOKEN_EXPIRED);
      }
    }
  }
}

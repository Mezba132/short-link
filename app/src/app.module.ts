import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { LinkModule } from './modules/link/link.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CheckTokenMiddleware } from './common/middleware/check-token.middleware';
import { UserModule } from './modules/user/user.module';
import { EndPoint } from './utility/end-points';
import { Task1Module } from './modules/task1/task1.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    LinkModule,
    UserModule,
    Task1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenMiddleware)
      .exclude(
        { path: EndPoint.SIGN_UP, method: RequestMethod.POST },
        { path: EndPoint.SIGN_IN, method: RequestMethod.POST },
        { path: EndPoint.REFRESH, method: RequestMethod.POST },
        { path: EndPoint.SHORTEN_LINK, method: RequestMethod.POST },
        { path: EndPoint.LINK_BY_ALIAS, method: RequestMethod.GET },
        { path: EndPoint.TASK1, method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

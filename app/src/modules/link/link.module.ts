import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from 'src/schemas/link.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Link.name, schema: LinkSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}

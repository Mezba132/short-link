import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from '../../schemas/link.schema';
import ShortUniqueId from 'short-unique-id';
import { CreateLinkDto } from './dto/create-link.dto';
import { ErrorMsg } from 'src/utility/custom-msg';

@Injectable()
export class LinkService {
  private uid: ShortUniqueId;

  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {
    this.uid = new ShortUniqueId({ length: 10 });
  }

  createLink = async (body: CreateLinkDto): Promise<Link> => {
    let { customAlias, expiresAt, ...rest } = body;
    const alias = this.uid.rnd();
    customAlias = customAlias?.toLowerCase().replace(/ /g, '-');

    const expiration = expiresAt || new Date(Date.now() + 20 * 60 * 1000);

    const existingAlias = await this.linkModel.findOne({ alias }).exec();
    const existingCustomAlias = customAlias
      ? await this.linkModel.findOne({ customAlias }).exec()
      : undefined;

    if (existingAlias) {
      throw new BadRequestException(ErrorMsg.LINK_ALREADY_EXIST);
    }

    if (existingCustomAlias) {
      throw new BadRequestException(ErrorMsg.LINK_ALREADY_EXIST);
    }

    const link = new this.linkModel({
      ...rest,
      alias,
      customAlias,
      expiresAt: expiration,
    });

    try {
      return await link.save();
    } catch (error) {
      if (error.name === ErrorMsg.VALIDATION_ERROR) {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw new Error(`Failed to save link: ${error.message}`);
    }
  };

  getLink = async (aliasOrCustomAlias: string): Promise<Link> => {
    const link = await this.linkModel
      .findOne({
        $or: [
          { alias: aliasOrCustomAlias },
          { customAlias: aliasOrCustomAlias },
        ],
        expiresAt: { $gte: new Date() },
      })
      .exec();

    if (!link || new Date() > new Date(link.expiresAt)) {
      throw new NotFoundException(ErrorMsg.LINK_NOT_FOUND);
    }

    if (link.isPrivate) {
      throw new UnauthorizedException(ErrorMsg.LINK_NOT_FOUND);
    }

    return link;
  };

  getAllLinkByUser = async (id: string): Promise<Link[]> => {
    const links = await this.linkModel
      .find({ user: id, expiresAt: { $gte: new Date() } })
      .exec();

    if (links.length === 0) {
      throw new NotFoundException(ErrorMsg.LINK_NOT_FOUND);
    }
    return links;
  };

  getAllLink = async (): Promise<Link[]> => {
    const links = await this.linkModel
      .find({ expiresAt: { $gte: new Date() } })
      .exec();

    if (links.length === 0) {
      throw new NotFoundException(ErrorMsg.LINK_NOT_FOUND);
    }
    return links;
  };

  incrementVisitCount = async (aliasOrCustomAlias: string): Promise<void> => {
    const result = await this.linkModel
      .updateOne(
        {
          $or: [
            { alias: aliasOrCustomAlias },
            { customAlias: aliasOrCustomAlias },
          ],
          expiresAt: { $gte: new Date() },
        },
        { $inc: { visitCount: 1 } },
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException(ErrorMsg.ALIAS_NOT_FOUND);
    }
  };
}

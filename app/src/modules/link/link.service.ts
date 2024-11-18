import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from '../../schemas/link.schema';
import ShortUniqueId from 'short-unique-id';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinkService {
  private uid: ShortUniqueId;

  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {
    this.uid = new ShortUniqueId({ length: 15 });
  }

  createLink = async (body: CreateLinkDto): Promise<Link> => {
    let { customAlias, expiresAt, ...rest } = body;
    const alias = this.uid.rnd();
    customAlias = customAlias?.toLowerCase().replace(/ /g, '-');

    const expiration =
      expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const existingAlias = await this.linkModel.findOne({ alias }).exec();
    const existingCustomAlias = customAlias
      ? await this.linkModel.findOne({ customAlias }).exec()
      : undefined;

    if (existingAlias) {
      throw new BadRequestException(
        'Generated alias conflict. Please try again.',
      );
    }

    if (existingCustomAlias) {
      throw new BadRequestException(
        'Custom alias already in use. Please choose another one.',
      );
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
      if (error.name === 'ValidationError') {
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
      })
      .exec();

    if (!link || new Date() > new Date(link.expiresAt)) {
      throw new NotFoundException('Link not found or expired');
    }

    return link;
  };

  getAllLinkByUser = async (id: string) => {
    const links = await this.linkModel.find({ user: id }).exec();

    if (links.length === 0) {
      throw new NotFoundException('Links not found');
    }
    return links;
  };

  getAllLink = async () => {
    const links = await this.linkModel.find({}).exec();

    if (links.length === 0) {
      throw new NotFoundException('Links not found');
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
        },
        { $inc: { visitCount: 1 } },
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('Alias not found');
    }
  };
}

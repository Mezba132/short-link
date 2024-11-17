import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Link } from 'src/schemas/link.schema';

@ApiTags('Links')
@Controller()
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({ status: 201, description: 'URL shortened successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBearerAuth()
  @Post('link/shorten')
  async shortenLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linkService.createLink(createLinkDto);
  }

  @ApiOperation({ summary: 'Redirect to the original URL using alias' })
  @ApiResponse({ status: 302, description: 'Redirect to the original URL.' })
  @ApiResponse({ status: 404, description: 'Alias not found or expired.' })
  @Get(':alias')
  @Redirect()
  async redirectToOriginal(
    @Param('alias') alias: string,
  ): Promise<{ url: string }> {
    await this.linkService.incrementVisitCount(alias);
    const link = await this.linkService.getLink(alias);
    return { url: link.originalUrl };
  }
}

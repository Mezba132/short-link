import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({ status: 302, description: 'Redirect to the original URL.' })
  @ApiResponse({ status: 404, description: 'Alias not found or expired.' })
  @ApiBearerAuth()
  @Get('link/:alias')
  async redirectToOriginal(@Param('alias') alias: string): Promise<Link> {
    await this.linkService.incrementVisitCount(alias);
    return await this.linkService.getLink(alias);
  }

  @ApiOperation({ summary: 'Fetch all link' })
  @ApiResponse({ status: 302, description: 'Successfully Fetch all link.' })
  @ApiResponse({ status: 404, description: 'link not found' })
  @ApiBearerAuth()
  @Get('links')
  async getAllLink() {
    return await this.linkService.getAllLink();
  }

  @ApiOperation({ summary: 'Fetch all link by user id' })
  @ApiResponse({
    status: 302,
    description: 'Successfully Fetch all link by user id',
  })
  @ApiResponse({ status: 404, description: 'link not found' })
  @ApiBearerAuth()
  @Get('link/user/:id')
  async getAllLinkByUser(@Param('id') id: string) {
    return await this.linkService.getAllLinkByUser(id);
  }
}

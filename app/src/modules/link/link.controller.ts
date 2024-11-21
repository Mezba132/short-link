import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Link } from 'src/schemas/link.schema';
import { ErrorMsg, SuccessMsg, Summary } from 'src/utility/custom-msg';
import { StatusCode } from 'src/utility/status-codes';
import { Tags } from 'src/utility/api-tags';
import { EndPoint } from 'src/utility/end-points';
import { hasRoles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/schemas/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags(Tags.LINK)
@Controller()
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @ApiOperation({ summary: Summary.SHORTEN_LINK })
  @ApiResponse({
    status: StatusCode.CREATED,
    description: SuccessMsg.SHORTEN_LINK,
  })
  @ApiBadRequestResponse({ description: ErrorMsg.INVALID_BODY })
  @Post(EndPoint.SHORTEN_LINK)
  async shortenLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linkService.createLink(createLinkDto);
  }

  @ApiOperation({ summary: Summary.REDIRECT_UNIQUE_ALIAS })
  @ApiResponse({ status: StatusCode.OK, description: SuccessMsg.LINK_REDIRECT })
  @ApiResponse({
    status: StatusCode.NOT_FOUND,
    description: ErrorMsg.ALIAS_NOT_FOUND,
  })
  @Get(EndPoint.LINK_BY_ALIAS)
  async redirectToOriginal(@Param('alias') alias: string, @Res() res: any) {
    let link = await this.linkService.getLink(alias);
    await this.linkService.incrementVisitCount(alias);
    res.redirect(link.originalUrl);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: Summary.ALL_LINKS })
  @ApiResponse({
    status: StatusCode.OK,
    description: SuccessMsg.FETCH_ALL_LINK,
  })
  @ApiResponse({
    status: StatusCode.NOT_FOUND,
    description: ErrorMsg.LINK_NOT_FOUND,
  })
  @Get(EndPoint.ALL_LINKS)
  @hasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getAllLink(): Promise<Link[]> {
    return await this.linkService.getAllLink();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: Summary.LINKS_BY_USERID })
  @ApiResponse({
    status: StatusCode.OK,
    description: SuccessMsg.FETCH_LINKS_BY_USERID,
  })
  @ApiResponse({
    status: StatusCode.NOT_FOUND,
    description: ErrorMsg.LINK_NOT_FOUND,
  })
  @Get(EndPoint.LINK_BY_USERID)
  @hasRoles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  async getAllLinkByUser(@Param('id') id: string): Promise<Link[]> {
    return await this.linkService.getAllLinkByUser(id);
  }
}

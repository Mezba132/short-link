import { Controller, Get } from '@nestjs/common';
import { Task1Service } from './task1.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('task1')
@ApiTags('Task 1')
export class Task1Controller {
  constructor(private readonly task1Service: Task1Service) {}

  @Get('lastIndex')
  getLastPairIndex(): number {
    return this.task1Service.findAll();
  }
}

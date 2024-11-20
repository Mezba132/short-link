import { Module } from '@nestjs/common';
import { Task1Service } from './task1.service';
import { Task1Controller } from './task1.controller';

@Module({
  controllers: [Task1Controller],
  providers: [Task1Service],
})
export class Task1Module {}

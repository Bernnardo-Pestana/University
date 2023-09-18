import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TaskCalendarService } from './task-calendar.service';
import { CreateTaskCalendarDto } from './dto/create-task-calendar.dto';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

@Controller('task-calendar')
export class TaskCalendarController {
  constructor(private readonly taskCalendarService: TaskCalendarService) {}

  @Post()
  create(@Request() req, @Body() createTaskCalendarDto: CreateTaskCalendarDto) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      'dr6XXiu71Zq4&gO7KejpHNabp',
    ) as JwtPayload;
    const userid = decodedToken.id;
    return this.taskCalendarService.create(userid, createTaskCalendarDto);
  }

  @Get()
  findAll(@Body() date: any) {
    return this.taskCalendarService.findAll(date.date);
  }

  @Get(':id')
  findMyTickets(@Param('id') id: string) {
    return this.taskCalendarService.findMyTickets(id);
  }

  @Get(':userId/history')
  findHistory(@Param('userId') id: string) {
    return this.taskCalendarService.findHistory(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskCalendarService.remove(id);
  }
}

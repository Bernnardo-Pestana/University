import { Module } from '@nestjs/common';
import { TaskCalendarService } from './task-calendar.service';
import { TaskCalendarController } from './task-calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskCalendar } from './entities/task-calendar.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskCalendar, Task])],
  controllers: [TaskCalendarController],
  providers: [TaskCalendarService, TasksService],
})
export class TaskCalendarModule {}

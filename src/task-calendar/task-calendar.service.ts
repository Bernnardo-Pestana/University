import { Injectable } from '@nestjs/common';
import { CreateTaskCalendarDto } from './dto/create-task-calendar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCalendar } from './entities/task-calendar.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class TaskCalendarService {
  constructor(
    @InjectRepository(TaskCalendar)
    private readonly taskCalendarRepository: Repository<TaskCalendar>,
    private readonly tasksService: TasksService,
  ) {}
  async create(userid: string, createTaskCalendarDto: CreateTaskCalendarDto) {
    createTaskCalendarDto.userid = userid;
    const taskCalendar = {
      ...createTaskCalendarDto,
    };
    const newTaskCalendar = await this.taskCalendarRepository.create(
      taskCalendar,
    );
    return this.taskCalendarRepository.save(newTaskCalendar);
  }

  async findAll(date: Date) {
    const dayOfTheWeek = new Date(date).getDay();
    const taskOnDay = await this.tasksService.find(dayOfTheWeek.toString());
    const daysOfWeekNames = [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ];
    return { taskOnDay, daysOfWeekNames: daysOfWeekNames[dayOfTheWeek] };
  }

  remove(id: number) {
    return `This action removes a #${id} taskCalendar`;
  }
}

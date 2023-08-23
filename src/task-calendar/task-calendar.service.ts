import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { taskid, day } = createTaskCalendarDto;
    const count = await this.taskCalendarRepository.count({
      where: { taskid, day },
    });
    if (count >= 20) {
      throw new ForbiddenException(
        'Activity full, please select another activity',
      );
    }
    const taskCalendar = new TaskCalendar();
    taskCalendar.userid = userid;
    taskCalendar.taskid = taskid;
    taskCalendar.day = day;
    const newTaskCalendar = await this.taskCalendarRepository.save(
      taskCalendar,
    );

    return newTaskCalendar;
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

  async findMyTickets(userid: string) {
    return this.taskCalendarRepository.find({ where: { userid } });
  }

  async remove(ticketid: string): Promise<void> {
    try {
      const ticket = await this.taskCalendarRepository.findOne({
        where: { ticketid },
      });
      if (!ticket) {
        throw new NotFoundException('ticket not found');
      }
      ticket.deletedAt = new Date();
      await this.taskCalendarRepository.save(ticket);
    } catch (error) {
      return error;
    }
  }
}

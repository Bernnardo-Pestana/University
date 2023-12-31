import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Raw, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskCalendar } from 'src/task-calendar/entities/task-calendar.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(userid: string, createTaskDto: CreateTaskDto) {
    try {
      createTaskDto.userid = userid;
      const dayAsString = createTaskDto.day.join(',');
      const transformedDto = {
        ...createTaskDto,
        day: dayAsString,
      };
      const task = await this.tasksRepository.create(transformedDto);
      return this.tasksRepository.save(task);
    } catch (error) {
      return error;
    }
  }

  async findAll(infoDay: any) {
    const tasks = await this.find(infoDay.day);
    const countTasks = await this.tasksRepository.count();
    const tasksFormatted = await Promise.all(
      tasks.map(async (task) => {
        const count = await this.tasksRepository
          .createQueryBuilder()
          .select('COUNT(taskCalendar.taskid)', 'count')
          .from(TaskCalendar, 'taskCalendar')
          .where('taskCalendar.taskid = :taskid', { taskid: task.taskid })
          .andWhere('CAST(taskCalendar.day as Date) = :day', { day: infoDay.date.split('T')[0] })
          .getRawOne();
        const day = task.day.split(',').map(Number);
        return {
          ...task,
          day: day,
          remaining: task.limit - count.count / countTasks,
        };
      }),
    );

    return tasksFormatted;
  }

  async find(day: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {
        day: Raw((alias) => `${alias} LIKE '%${day}%'`),
      },
    });
  }

  async findOne(taskid: string) {
    const task = await this.tasksRepository.findOne({ where: { taskid } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskid} not found`);
    }

    const count = await this.tasksRepository.count({
      where: { taskid, day: task.day }, // Correção 3
    });

    const day = task.day.split(',').map(Number);

    return {
      ...task,
      day: day,
      remaining: task.limit - count,
    };
  }

  async update(taskid: string, updateTaskDto: any) {
    const dayAsString = updateTaskDto.day.join(',');
    const transformedDto = {
      ...updateTaskDto,
      day: dayAsString,
    };
    const task = await this.tasksRepository.preload({
      taskid: taskid,
      ...transformedDto,
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskid} not found`);
    }
    return this.tasksRepository.save(task);
  }
  async remove(taskid: string): Promise<void> {
    try {
      const task = await this.tasksRepository.findOne({ where: { taskid } });
      if (!task) {
        throw new NotFoundException('task not found');
      }
      task.deletedAt = new Date();
      await this.tasksRepository.save(task);
    } catch (error) {
      return error;
    }
  }
  async undelete(taskid: string): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOne({
        where: { taskid, deletedAt: Not(IsNull()) },
        withDeleted: true,
      });
      if (!task) {
        throw new NotFoundException('task not found or not soft-deleted');
      }
      task.deletedAt = null;
      return this.tasksRepository.save(task);
    } catch (error) {
      return error;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async create(userid: string, createTaskDto: CreateTaskDto) {
    createTaskDto.userid = userid;
    const task = await this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async findAll() {
    return this.tasksRepository.find();
  }

  async findOne(taskid: string) {
    const task = await this.tasksRepository.findOne({ where: { taskid } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskid} not found`);
    }
    return task;
  }

  async update(taskid: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.preload({
      taskid: taskid,
      ...updateTaskDto,
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

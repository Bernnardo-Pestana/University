import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TaskCalendar {
  @PrimaryColumn()
  ticketid: string;

  @Column()
  userid: string;

  @Column()
  taskid: string;

  @Column()
  day: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToMany(() => Task, (task) => task.taskCalendars)
  tasks: Task[];

  constructor() {
    this.ticketid = !this.ticketid ? uuidv4() : '';
  }
}

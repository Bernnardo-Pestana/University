import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  constructor() {
    this.ticketid = !this.ticketid ? uuidv4() : '';
  }
}

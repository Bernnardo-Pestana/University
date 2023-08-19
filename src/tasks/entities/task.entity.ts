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
export class Task {
  @PrimaryColumn()
  taskid: string;

  @Column()
  userid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  day: string;

  @Column()
  hour: string;

  @Column()
  instructor: string;

  @Column()
  limit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  constructor() {
    this.taskid = !this.taskid ? uuidv4() : '';
  }
}

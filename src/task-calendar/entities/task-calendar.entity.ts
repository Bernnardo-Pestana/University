import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskCalendar {
  @PrimaryColumn()
  userid: string;

  @Column()
  taskid: string;

  @Column()
  day: Date;
}

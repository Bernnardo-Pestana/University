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
export class Parking {
  @PrimaryColumn()
  ticketParkid: string;

  @Column()
  slot: string;

  @Column()
  userid: string;

  @Column()
  day: Date;

  @Column()
  hour: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  constructor() {
    this.ticketParkid = !this.ticketParkid ? uuidv4() : '';
  }
}

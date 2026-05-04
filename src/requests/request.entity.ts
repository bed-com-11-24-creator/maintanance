import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum RequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // Oracle does not support enum type — use varchar2 with TS enum for type safety
  @Column({
    type: 'varchar2',
    length: 20,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  // ✅ Relationship (this part was already correct)
  @ManyToOne(() => User, (user) => user.requests, { eager: true })
  user: User;
}
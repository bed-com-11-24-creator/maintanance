import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { IssuePhoto } from './issue-photo.entity';
import { IssueTimeline } from './issue-timeline.entity';
import { IssueStatus, IssueUrgency, IssueCategory } from '../../common/enums/issue.enums';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'varchar2', length: 1000 })
  description!: string;

  @Column()
  block!: string;

  @Column()
  roomNumber!: string;

  @Column({
    type: 'varchar2',
    length: 30,
    default: IssueCategory.OTHER,
  })
  category!: IssueCategory;

  @Column({
    type: 'varchar2',
    length: 20,
    default: IssueUrgency.MEDIUM,
  })
  urgency!: IssueUrgency;

  @Column({
    type: 'varchar2',
    length: 20,
    default: IssueStatus.PENDING,
  })
  status!: IssueStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Student who reported the issue
  @ManyToOne(() => User, (user) => user.issues)
  student!: User;

  // Worker assigned to the issue
  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  worker!: User;

  @OneToMany(() => IssuePhoto, (photo) => photo.issue)
  photos!: IssuePhoto[];

  @OneToMany(() => IssueTimeline, (timeline) => timeline.issue)
  timelineEntries!: IssueTimeline[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class IssueTimeline {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event!: string; // e.g., "Reported", "Assigned", "Resolved", "Manual Update"

  @Column({ type: 'varchar2', length: 500, nullable: true })
  description!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => Issue, (issue) => issue.timelineEntries, { onDelete: 'CASCADE' })
  issue!: Issue;
}

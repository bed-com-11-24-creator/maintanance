import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class IssuePhoto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @CreateDateColumn()
  uploadedAt!: Date;

  @ManyToOne(() => Issue, (issue) => issue.photos, { onDelete: 'CASCADE' })
  issue!: Issue;
}

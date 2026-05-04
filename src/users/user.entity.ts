import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from '../common/enums/user.enums';
export { UserRole };
import type { Issue } from '../issues/entities/issue.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ unique: true, nullable: true })
  idNumber!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column({
    type: 'varchar2',
    length: 20,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @OneToMany('Issue', (issue: Issue) => issue.student)
  issues!: Issue[];

  @OneToMany('Issue', (issue: Issue) => issue.worker)
  assignedTasks!: Issue[];
}
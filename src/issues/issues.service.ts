import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { IssueStatus } from '../common/enums/issue.enums';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { User } from '../users/user.entity';
import { IssueTimeline } from './entities/issue-timeline.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
    @InjectRepository(IssueTimeline)
    private timelineRepository: Repository<IssueTimeline>,
  ) {}

  async create(dto: CreateIssueDto, student: User) {
    const issue = this.issuesRepository.create({
      ...dto,
      student,
    });
    
    const savedIssue = await this.issuesRepository.save(issue);
    
    // Log initial timeline event
    await this.logTimeline(savedIssue, 'Reported', 'Issue submitted by student');
    
    return savedIssue;
  }

  findAll(filters?: { status?: string, urgency?: string, block?: string }) {
    const query = this.issuesRepository.createQueryBuilder('issue')
      .leftJoinAndSelect('issue.student', 'student')
      .leftJoinAndSelect('issue.worker', 'worker');

    if (filters?.status) {
      query.andWhere('issue.status = :status', { status: filters.status });
    }
    if (filters?.urgency) {
      query.andWhere('issue.urgency = :urgency', { urgency: filters.urgency });
    }
    if (filters?.block) {
      query.andWhere('issue.block = :block', { block: filters.block });
    }

    return query.getMany();
  }

  findMy(studentId: number) {
    return this.issuesRepository.find({
      where: { student: { id: studentId } },
      relations: ['worker'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const issue = await this.issuesRepository.findOne({
      where: { id },
      relations: ['student', 'worker', 'photos', 'timelineEntries'],
    });

    if (!issue) throw new NotFoundException(`Issue #${id} not found`);
    return issue;
  }

  async update(id: number, dto: UpdateIssueDto) {
    const issue = await this.findOne(id);
    
    const { workerId, ...updateData } = dto;
    
    if (workerId) {
      // Logic to assign worker would go here, assuming worker exists
      issue.worker = { id: workerId } as User;
      await this.logTimeline(issue, 'Assigned', `Issue assigned to worker #${workerId}`);
    }

    if (dto.status && dto.status !== issue.status) {
      await this.logTimeline(issue, 'Status Updated', `Status changed from ${issue.status} to ${dto.status}`);
    }

    Object.assign(issue, updateData);
    return this.issuesRepository.save(issue);
  }

  async remove(id: number) {
    const issue = await this.findOne(id);
    return this.issuesRepository.remove(issue);
  }

  async logTimeline(issue: Issue, event: string, description?: string) {
    const entry = this.timelineRepository.create({
      issue,
      event,
      description,
    });
    return this.timelineRepository.save(entry);
  }

  async addManualTimelineEntry(id: number, event: string, description: string) {
    const issue = await this.findOne(id);
    return this.logTimeline(issue, event, description);
  }
}

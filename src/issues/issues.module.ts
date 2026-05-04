import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { Issue } from './entities/issue.entity';
import { IssuePhoto } from './entities/issue-photo.entity';
import { IssueTimeline } from './entities/issue-timeline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, IssuePhoto, IssueTimeline])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}

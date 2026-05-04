import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user.enums';
import { IssuesService } from '../issues/issues.service';
import { IssueStatus, IssueUrgency } from '../common/enums/issue.enums';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly issuesService: IssuesService) {}

  @Roles(UserRole.ADMINISTRATOR)
  @Get('stats')
  async getStats() {
    const allIssues = await this.issuesService.findAll();
    
    return {
      total: allIssues.length,
      pending: allIssues.filter(i => i.status === IssueStatus.PENDING).length,
      inProgress: allIssues.filter(i => i.status === IssueStatus.IN_PROGRESS).length,
      urgent: allIssues.filter(i => i.urgency === IssueUrgency.EMERGENCY || i.urgency === IssueUrgency.HIGH).length,
      resolved: allIssues.filter(i => i.status === IssueStatus.RESOLVED).length,
    };
  }
}

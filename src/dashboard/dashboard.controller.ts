import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user.enums';
import { IssuesService } from '../issues/issues.service';

@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly issuesService: IssuesService) {}

  @Roles(UserRole.ADMINISTRATOR)
  @Get('stats')
  async getStats() {
    const allIssues: any[] = await this.issuesService.findAll() as any[];
    return {
      total: allIssues.length,
      pending: allIssues.filter(i => i.STATUS === 'Pending').length,
      inProgress: allIssues.filter(i => i.STATUS === 'In Progress').length,
      urgent: allIssues.filter(i => i.URGENCY === 'emergency' || i.URGENCY === 'high').length,
      resolved: allIssues.filter(i => i.STATUS === 'Resolved').length,
    };
  }
}
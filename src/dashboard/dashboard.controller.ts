import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user.enums';
import { IssuesService } from '../issues/issues.service';
import { getConnection } from '../database/database.providers';
import oracledb from 'oracledb';

@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly issuesService: IssuesService) {}

  @Roles(UserRole.ADMINISTRATOR)
  @Get('stats')
  async getStats() {
    const allIssues: any[] = await this.issuesService.findAll() as any[];

    const normalize = (val: string) => (val || '').toLowerCase().trim();

    const pending    = allIssues.filter(i => normalize(i.STATUS) === 'pending').length;
    const inProgress = allIssues.filter(i => normalize(i.STATUS) === 'in_progress').length;
    const resolved   = allIssues.filter(i => normalize(i.STATUS) === 'resolved').length;
    const total      = allIssues.length;

    // Count users directly from DB
    let userCount = 0;
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT COUNT(*) FROM USERS`,
        [],
      );
      const rows = result.rows as any[][];
      userCount = Number(rows[0][0]) || 0;
      console.log('USER COUNT RAW:', rows[0][0], 'parsed:', userCount);
    } finally {
      await connection.close();
    }

    return {
      total,
      pending,
      in_progress: inProgress,
      resolved,
      users: userCount,
    };
  }
}
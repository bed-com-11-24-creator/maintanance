import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { IssuesModule } from '../issues/issues.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [IssuesModule, UsersModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [IssuesModule],
  controllers: [DashboardController],
})
export class DashboardModule {}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('issues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Roles(UserRole.STUDENT)
  @Post()
  create(@Body() dto: CreateIssueDto, @Req() req: any) {
    return this.issuesService.create(dto, req.user);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('urgency') urgency?: string,
    @Query('block') block?: string,
  ) {
    return this.issuesService.findAll({ status, urgency, block });
  }

  @Roles(UserRole.STUDENT)
  @Get('my')
  findMy(@Req() req: any) {
    return this.issuesService.findMy(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
    return this.issuesService.update(+id, dto);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }

  @Get(':id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.issuesService.findOne(+id).then(issue => issue.timelineEntries);
  }

  @Post(':id/timeline')
  @Roles(UserRole.ADMINISTRATOR, UserRole.WORKER)
  addTimelineEntry(
    @Param('id') id: string,
    @Body('event') event: string,
    @Body('description') description: string
  ) {
    return this.issuesService.addManualTimelineEntry(+id, event, description);
  }
}

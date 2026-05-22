import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user.enums';

const photoStorage = diskStorage({
  destination: './uploads/issues',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@ApiBearerAuth('JWT-auth')
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
    @Query('category') category?: string,
  ) {
    return this.issuesService.findAll({ status, urgency, category });
  }

  @Get('my')
  findMy(@Req() req: any) {
    return this.issuesService.findMy(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
    return this.issuesService.update(id, dto);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }

  @Get(':id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.issuesService.getTimeline(id);
  }

  @Post(':id/timeline')
  @Roles(UserRole.ADMINISTRATOR, UserRole.WORKER)
  addTimelineEntry(
    @Param('id') id: string,
    @Body('event') event: string,
    @Body('description') description: string
  ) {
    return this.issuesService.addManualTimelineEntry(id, event, description);
  }

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('photo', { storage: photoStorage }))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('No file uploaded');
    const photoUrl = `/uploads/issues/${file.filename}`;
    await this.issuesService.savePhotoUrl(id, photoUrl);
    return { photoUrl };
  }

  @Get(':id/photos')
  async getPhotos(@Param('id') id: string) {
    return this.issuesService.getPhotos(id);
  }
}
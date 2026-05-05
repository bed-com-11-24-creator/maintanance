import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  // Admin creates notification
  @Post('admin')
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  // Get notifications for a user
  @Get(':userId')
  getUserNotifications(@Param('userId') userId: string) {
    return this.service.findForUser(Number(userId));
  }
}
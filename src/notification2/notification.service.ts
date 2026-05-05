import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = this.repo.create({
      ...dto,
      userId: dto.userId ?? null, // null = broadcast
    });

    return this.repo.save(notification);
  }

  async findForUser(userId: number) {
    return this.repo.find({
      where: [
        { userId },
        { userId: null },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
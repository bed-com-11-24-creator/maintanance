import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { User } from '../users/user.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,
  ) {}

  create(dto: CreateRequestDto, user: User) {
    const request = this.requestRepo.create({
      ...dto,
      user,
    });

    return this.requestRepo.save(request);
  }

  findAll() {
    return this.requestRepo.find();
  }

  findMyRequests(userId: number) {
    return this.requestRepo.find({
      where: { user: { id: userId } },
    });
  }

  // ✅ MUST BE INSIDE THE CLASS
  async updateStatus(id: number, status: RequestStatus) {
    const result = await this.requestRepo.update(id, { status });

    if (result.affected === 0) {
      throw new Error('Request not found');
    }

    return { message: 'Status updated successfully' };
  }
}
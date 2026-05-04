import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  findAll() {
    return this.roomsRepository.find({ order: { block: 'ASC', roomNumber: 'ASC' } });
  }

  create(dto: any) {
    const room = this.roomsRepository.create(dto);
    return this.roomsRepository.save(room);
  }
}

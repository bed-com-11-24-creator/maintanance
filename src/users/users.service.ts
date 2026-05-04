import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // ✅ FIXED CREATE (NO HASHING HERE)
  async create(data: any) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find({
      select: ['id', 'name', 'email', 'role', 'idNumber', 'phoneNumber'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'idNumber', 'phoneNumber'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByRole(role: UserRole) {
    return this.userRepo.find({
      where: { role },
      select: ['id', 'name', 'email', 'role', 'idNumber', 'phoneNumber'],
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, data: any) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
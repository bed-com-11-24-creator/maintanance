import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

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
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByRole(role: UserRole) {
    return this.userRepo.find({
      where: { role },
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
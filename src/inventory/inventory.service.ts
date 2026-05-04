import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  create(dto: any) {
    const item = this.inventoryRepository.create(dto);
    return this.inventoryRepository.save(item);
  }

  findAll() {
    return this.inventoryRepository.find();
  }

  async findOne(id: number) {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Inventory item #${id} not found`);
    return item;
  }

  async update(id: number, dto: any) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.inventoryRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.inventoryRepository.remove(item);
  }
}

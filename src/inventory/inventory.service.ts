import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { getConnection } from '../database/database.providers';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import oracledb from 'oracledb';

@Injectable()
export class InventoryService {

  async create(dto: CreateInventoryDto) {
    if (!dto || !dto.name) { 
      throw new BadRequestException('Request body is missing or invalid');
    }
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO INVENTORY (name, type, quantity, location, status, created_at, updated_at)
         VALUES (:name, :type, :quantity, :location, :status, SYSDATE, SYSDATE)
         RETURNING id INTO :id`,
        {
          name: dto.name,
          type: dto.type,
          quantity: dto.quantity,
          location: dto.location,
          status: dto.status || 'In Stock',
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
        { autoCommit: true },
      );
      return { id: (result.outBinds as any).id[0], ...dto };
    } finally {
      await connection.close();
    }
  }

  async findAll() {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, name, type, quantity, location, status, created_at, updated_at FROM INVENTORY`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async findOne(id: number) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, name, type, quantity, location, status, created_at, updated_at 
         FROM INVENTORY WHERE id = :id`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      if (!result.rows || result.rows.length === 0) {
        throw new NotFoundException(`Inventory item #${id} not found`);
      }
      return result.rows[0];
    } finally {
      await connection.close();
    }
  }

  async update(id: number, dto: UpdateInventoryDto) {
    await this.findOne(id);
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE INVENTORY 
         SET name = :name, type = :type, quantity = :quantity, 
             location = :location, status = :status, updated_at = SYSDATE
         WHERE id = :id`,
        {
          name: dto.name,
          type: dto.type,
          quantity: dto.quantity,
          location: dto.location,
          status: dto.status,
          id,
        },
        { autoCommit: true },
      );
      return { id, ...dto };
    } finally {
      await connection.close();
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    const connection = await getConnection();
    try {
      await connection.execute(
        `DELETE FROM INVENTORY WHERE id = :id`,
        [id],
        { autoCommit: true },
      );
      return { message: `Inventory item #${id} deleted successfully` };
    } finally {
      await connection.close();
    }
  }
}
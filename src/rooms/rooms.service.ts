import { Injectable } from '@nestjs/common';
import { getConnection } from '../database/database.providers';
import oracledb from 'oracledb';

@Injectable()
export class RoomsService {

  async findAll() {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, hostel_id, room_number, floor_num, capacity, created_at FROM ROOMS ORDER BY room_number ASC`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async create(dto: any) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO ROOMS (hostel_id, room_number, floor_num, capacity, created_at)
         VALUES (:hostelId, :roomNumber, :floorNum, :capacity, SYSDATE)
         RETURNING id INTO :id`,
        {
          hostelId: dto.hostelId,
          roomNumber: dto.roomNumber,
          floorNum: dto.floorNum,
          capacity: dto.capacity,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
        { autoCommit: true },
      );
      return { id: (result.outBinds as any).id[0], ...dto };
    } finally {
      await connection.close();
    }
  }
}
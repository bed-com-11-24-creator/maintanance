import { Injectable, NotFoundException } from '@nestjs/common';
import { getConnection } from '../database/database.providers';
import oracledb from 'oracledb';
import { UserRole } from '../common/enums/user.enums';

@Injectable()
export class UsersService {

  async create(data: any) {
    const connection = await getConnection();
    try {
      const id = Date.now().toString();
      await connection.execute(
        `INSERT INTO USERS (id, full_name, email, password_hash, role, reg_number, phone, is_active, created_at, updated_at)
         VALUES (:id, :fullName, :email, :passwordHash, :role, :regNumber, :phone, 1, SYSDATE, SYSDATE)`,
        {
          id,
          fullName: data.name,
          email: data.email,
          passwordHash: data.password,
          role: data.role,
          regNumber: data.idNumber,
          phone: data.phoneNumber,
        },
        { autoCommit: true },
      );
      return { id, ...data };
    } finally {
      await connection.close();
    }
  }

  async findAll() {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, full_name, email, role, reg_number, phone FROM USERS`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async findOne(id: string) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, full_name, email, role, reg_number, phone FROM USERS WHERE id = :id`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      if (!result.rows || result.rows.length === 0)
        throw new NotFoundException('User not found');
      return result.rows[0];
    } finally {
      await connection.close();
    }
  }

  async findByRole(role: UserRole) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, full_name, email, role, reg_number, phone FROM USERS WHERE role = :role`,
        [role],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async findByEmail(email: string) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT id, full_name, email, password_hash, role, reg_number, phone FROM USERS WHERE email = :email`,
        [email],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      if (!result.rows || result.rows.length === 0) return null;
      return result.rows[0];
    } finally {
      await connection.close();
    }
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE USERS SET full_name = :fullName, email = :email, role = :role,
         reg_number = :regNumber, phone = :phone WHERE id = :id`,
        {
          fullName: data.FULL_NAME ?? data.fullName ?? data.name ?? null,
          email: data.EMAIL ?? data.email ?? null,
          role: data.ROLE ?? data.role ?? null,
          regNumber: data.REG_NUMBER ?? data.regNumber ?? data.idNumber ?? null,
          phone: data.PHONE ?? data.phone ?? data.phoneNumber ?? null,
          id,
        },
        { autoCommit: true },
      );
      return { id, ...data };
    } finally {
      await connection.close();
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const connection = await getConnection();
    try {
      await connection.execute(
        `DELETE FROM USERS WHERE id = :id`,
        [id],
        { autoCommit: true },
      );
      return { message: `User #${id} deleted successfully` };
    } finally {
      await connection.close();
    }
  }
}
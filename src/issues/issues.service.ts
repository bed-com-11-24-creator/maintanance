import { Injectable, NotFoundException } from '@nestjs/common';
import { getConnection } from '../database/database.providers';
import oracledb from 'oracledb';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssuesService {

  async create(dto: CreateIssueDto, student: any) {
    const connection = await getConnection();
    try {
      const id = Date.now().toString();
      await connection.execute(
        `INSERT INTO ISSUES (id, title, description, category, urgency, status, submitted_by, room_id, created_at, updated_at)
         VALUES (:id, :title, :description, :category, :urgency, 'Pending', :submittedBy, :roomId, SYSDATE, SYSDATE)`,
        {
          id,
          title: dto.title,
          description: dto.description,
          category: dto.category,
          urgency: dto.urgency,
          submittedBy: student.userId,
          roomId: null,
        },
        { autoCommit: true },
      );
      await this.logTimeline(id, 'Reported', 'Issue submitted by student');
      return { id, ...dto, submittedBy: student.userId };
    } finally {
      await connection.close();
    }
  }

  async findAll(filters?: { status?: string; urgency?: string; category?: string }) {
    const connection = await getConnection();
    try {
      let query = `SELECT i.*, u.full_name as student_name, w.full_name as worker_name
                   FROM ISSUES i
                   LEFT JOIN USERS u ON i.submitted_by = u.id
                   LEFT JOIN USERS w ON i.assigned_to = w.id
                   WHERE 1=1`;
      const binds: any = {};
      if (filters?.status) { query += ` AND i.status = :status`; binds.status = filters.status; }
      if (filters?.urgency) { query += ` AND i.urgency = :urgency`; binds.urgency = filters.urgency; }
      if (filters?.category) { query += ` AND i.category = :category`; binds.category = filters.category; }
      const result = await connection.execute(query, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async findMy(studentId: string) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT i.*, w.full_name as worker_name FROM ISSUES i
         LEFT JOIN USERS w ON i.assigned_to = w.id
         WHERE i.submitted_by = :studentId ORDER BY i.created_at DESC`,
        [studentId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      return result.rows;
    } finally {
      await connection.close();
    }
  }

  async findOne(id: any) {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT i.*, u.full_name as student_name, w.full_name as worker_name
         FROM ISSUES i
         LEFT JOIN USERS u ON i.submitted_by = u.id
         LEFT JOIN USERS w ON i.assigned_to = w.id
         WHERE i.id = :id`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      if (!result.rows || result.rows.length === 0)
        throw new NotFoundException(`Issue #${id} not found`);
      return result.rows[0];
    } finally {
      await connection.close();
    }
  }

  async update(id: any, dto: UpdateIssueDto) {
    const issue: any = await this.findOne(id);
    const connection = await getConnection();
    try {
      const { workerId, status } = dto as any;
      if (workerId) await this.logTimeline(id, 'Assigned', `Issue assigned to worker #${workerId}`);
      if (status && status !== issue.STATUS) await this.logTimeline(id, 'Status Updated', `Status changed from ${issue.STATUS} to ${status}`);
      await connection.execute(
        `UPDATE ISSUES SET status = :status, assigned_to = :assignedTo, updated_at = SYSDATE WHERE id = :id`,
        { status: status || issue.STATUS, assignedTo: workerId || issue.ASSIGNED_TO, id },
        { autoCommit: true },
      );
      return await this.findOne(id);
    } finally {
      await connection.close();
    }
  }

  async remove(id: any) {
    await this.findOne(id);
    const connection = await getConnection();
    try {
      await connection.execute(`DELETE FROM ISSUES WHERE id = :id`, [id], { autoCommit: true });
      return { message: `Issue #${id} deleted successfully` };
    } finally {
      await connection.close();
    }
  }

  async logTimeline(issueId: any, event: string, note?: string) {
    const connection = await getConnection();
    try {
      await connection.execute(
        `INSERT INTO ISSUE_TIMELINE (issue_id, event_type, note, created_at)
         VALUES (:issueId, :eventType, :note, SYSDATE)`,
        { issueId, eventType: event, note: note || '' },
        { autoCommit: true },
      );
    } finally {
      await connection.close();
    }
  }

  async addManualTimelineEntry(id: any, event: string, description: string) {
    await this.findOne(id);
    return this.logTimeline(id, event, description);
  }
}
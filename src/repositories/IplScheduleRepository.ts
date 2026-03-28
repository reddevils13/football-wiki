import { Knex } from 'knex';
import { IplSchedule, CreateIplScheduleDTO, UpdateIplScheduleDTO } from '../models/IplSchedule';
import { uuidv7 } from 'uuidv7';

export class IplScheduleRepository {
  private tableName = 'iplSchedule';

  constructor(private db: Knex) {}

  async create(data: CreateIplScheduleDTO): Promise<IplSchedule> {
    const id = uuidv7();
    await this.db(this.tableName).insert({
      id,
      ...data
    });
    return this.findById(id) as Promise<IplSchedule>;
  }

  async findById(id: string): Promise<IplSchedule | null> {
    const schedule = await this.db(this.tableName).where({ id }).first();
    return schedule || null;
  }

  async findAll(): Promise<IplSchedule[]> {
    return this.db(this.tableName).select('*').orderBy('startTime', 'asc');
  }

  async findUpcoming(): Promise<IplSchedule[]> {
    return this.db(this.tableName)
      .where('startTime', '>', this.db.fn.now())
      .orderBy('startTime', 'asc');
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IplSchedule[]> {
    return this.db(this.tableName)
      .whereBetween('startTime', [startDate, endDate])
      .orderBy('startTime', 'asc');
  }

  async update(id: string, data: UpdateIplScheduleDTO): Promise<IplSchedule | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }
}

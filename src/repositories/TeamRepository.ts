import { Knex } from 'knex';
import { Team, CreateTeamDTO, UpdateTeamDTO } from '../models/Team';
import { uuidv7 } from 'uuidv7';

export class TeamRepository {
  private tableName = 'team';

  constructor(private db: Knex) {}

  async create(data: CreateTeamDTO): Promise<Team> {
    const id = uuidv7();
    await this.db(this.tableName).insert({
      id,
      ...data
    });
    return this.findById(id) as Promise<Team>;
  }

  async findById(id: string): Promise<Team | null> {
    const team = await this.db(this.tableName).where({ id }).first();
    return team || null;
  }

  async findAll(): Promise<Team[]> {
    return this.db(this.tableName).select('*');
  }

  async update(id: string, data: UpdateTeamDTO): Promise<Team | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  async findByName(name: string): Promise<Team[]> {
    return this.db(this.tableName)
      .where('teamName', 'like', `%${name}%`)
      .select('*');
  }
}

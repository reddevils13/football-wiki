import { Knex } from 'knex';
import { League, CreateLeagueDTO, UpdateLeagueDTO } from '../models/League';
import { uuidv7 } from 'uuidv7';

export class LeagueRepository {
  private tableName = 'leagues';

  constructor(private db: Knex) {}

  async create(data: CreateLeagueDTO): Promise<League> {
    const id = uuidv7();
    await this.db(this.tableName).insert({
      id,
      ...data
    });
    return this.findById(id) as Promise<League>;
  }

  async findById(id: string): Promise<League | null> {
    const league = await this.db(this.tableName).where({ id }).first();
    return league || null;
  }

  async findAll(): Promise<League[]> {
    return this.db(this.tableName).select('*');
  }

  async update(id: string, data: UpdateLeagueDTO): Promise<League | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  async findByName(name: string): Promise<League[]> {
    return this.db(this.tableName)
      .where('leagueName', 'like', `%${name}%`)
      .select('*');
  }
}

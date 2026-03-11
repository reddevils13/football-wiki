import { Knex } from 'knex';
import { Player, CreatePlayerDTO, UpdatePlayerDTO } from '../models/Player';
import { uuidv7 } from 'uuidv7';

export class PlayerRepository {
  private tableName = 'players';

  constructor(private db: Knex) {}

  async create(data: CreatePlayerDTO): Promise<Player> {
    const id = uuidv7();
    await this.db(this.tableName).insert({
      id,
      ...data
    });
    return this.findById(id) as Promise<Player>;
  }

  async findById(id: string): Promise<Player | null> {
    const player = await this.db(this.tableName).where({ id }).first();
    return player || null;
  }

  async findAll(): Promise<Player[]> {
    return this.db(this.tableName).select('*');
  }

  async update(id: string, data: UpdatePlayerDTO): Promise<Player | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  async findByLevel(level: string): Promise<Player[]> {
    return this.db(this.tableName).where({ level }).select('*');
  }

  async getRandomPlayer(): Promise<Player | null> {
    const player = await this.db(this.tableName)
      .orderByRaw('RAND()')
      .limit(1)
      .first();
    return player || null;
  }

  async getRandomPlayerByLevel(level: string): Promise<Player | null> {
    const player = await this.db(this.tableName)
      .where({ level: level.toUpperCase() })
      .orderByRaw('RAND()')
      .limit(1)
      .first();
    return player || null;
  }

  async getPlayerCount(): Promise<number> {
    const result = await this.db(this.tableName).count('id as count').first();
    return result ? Number(result.count) : 0;
  }
}

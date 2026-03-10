import { Knex } from 'knex';
import { PlayerCareer, CreatePlayerCareerDTO, UpdatePlayerCareerDTO } from '../models/PlayerCareer';
import { PlayerCareerWithDetails } from '../dto/PlayerCareerDto';
import { uuidv7 } from 'uuidv7';

export class PlayerCareerRepository {
  private tableName = 'playerCareer';

  constructor(private db: Knex) {}

  async create(data: CreatePlayerCareerDTO): Promise<PlayerCareer> {
    const id = uuidv7();
    await this.db(this.tableName).insert({
      id,
      ...data
    });
    return this.findById(id) as Promise<PlayerCareer>;
  }

  async findById(id: string): Promise<PlayerCareer | null> {
    const career = await this.db(this.tableName).where({ id }).first();
    return career || null;
  }

  async findAll(): Promise<PlayerCareer[]> {
    return this.db(this.tableName).select('*');
  }

  async update(id: string, data: UpdatePlayerCareerDTO): Promise<PlayerCareer | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  async findByPlayerId(playerId: string): Promise<PlayerCareer[]> {
    return this.db(this.tableName).where({ playerId }).select('*');
  }

  async findByTeamId(teamId: string): Promise<PlayerCareer[]> {
    return this.db(this.tableName).where({ teamId }).select('*');
  }

  async findByLeagueId(leagueId: string): Promise<PlayerCareer[]> {
    return this.db(this.tableName).where({ leagueId }).select('*');
  }

  async findPlayerCareerWithDetails(playerId: string): Promise<PlayerCareerWithDetails[]> {
    return this.db(this.tableName)
      .where(`${this.tableName}.playerId`, playerId)
      .join('team', `${this.tableName}.teamId`, 'team.id')
      .join('leagues', `${this.tableName}.leagueId`, 'leagues.id')
      .select(
        `${this.tableName}.*`,
        'team.teamName',
        'leagues.leagueName'
      );
  }
}

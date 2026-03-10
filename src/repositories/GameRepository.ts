import { Knex } from 'knex';
import { Game, CreateGameDTO, UpdateGameDTO } from '../models/Game';
import { GameWithPlayerDetails } from '../dto/GameDto';
import { uuidv7 } from 'uuidv7';

export class GameRepository {
  private tableName = 'games';

  constructor(private db: Knex) {}

  async create(data: CreateGameDTO): Promise<Game> {
    const id = uuidv7();
    const game: Game = {
      id,
      playerId: data.playerId
    };
    await this.db(this.tableName).insert(game);
    return game;
  }

  async findById(id: string): Promise<Game | null> {
    const game = await this.db(this.tableName).where({ id }).first();
    return game || null;
  }

  async findAll(): Promise<Game[]> {
    return this.db(this.tableName).select('*');
  }

  async update(id: string, data: UpdateGameDTO): Promise<Game | null> {
    await this.db(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db(this.tableName).where({ id }).delete();
    return deleted > 0;
  }

  async findByPlayerId(playerId: string): Promise<Game[]> {
    return this.db(this.tableName).where({ playerId }).select('*');
  }

  async findGamesWithPlayerDetails(playerId?: string): Promise<GameWithPlayerDetails[]> {
    const query = this.db(this.tableName)
      .join('players', `${this.tableName}.playerId`, 'players.id')
      .select(
        `${this.tableName}.*`,
        'players.playerName',
        'players.level'
      );

    if (playerId) {
      query.where(`${this.tableName}.playerId`, playerId);
    }

    return query;
  }

  async findGameWithPlayerById(gameId: string): Promise<(Game & { playerName: string }) | null> {
    const result = await this.db(this.tableName)
      .join('players', `${this.tableName}.playerId`, 'players.id')
      .where(`${this.tableName}.id`, gameId)
      .select(
        `${this.tableName}.id`,
        `${this.tableName}.playerId`,
        'players.playerName'
      )
      .first();
    return result || null;
  }
}

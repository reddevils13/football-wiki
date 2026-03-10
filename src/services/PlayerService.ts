import { includes, values, join, isNil } from 'lodash';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { Player, CreatePlayerDTO, UpdatePlayerDTO, PlayerLevel } from '../models/Player';

export class PlayerService {
  constructor(private playerRepository: PlayerRepository) {}

  async createPlayer(data: CreatePlayerDTO): Promise<Player> {
    if (!includes(values(PlayerLevel), data.level)) {
      throw new Error(`Invalid player level. Must be one of: ${join(values(PlayerLevel), ', ')}`);
    }
    return this.playerRepository.create(data);
  }

  async getPlayerById(id: string): Promise<Player | null> {
    return this.playerRepository.findById(id);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.findAll();
  }

  async updatePlayer(id: string, data: UpdatePlayerDTO): Promise<Player | null> {
    const player = await this.playerRepository.findById(id);
    if (isNil(player)) {
      throw new Error('Player not found');
    }
    
    if (data.level && !includes(values(PlayerLevel), data.level)) {
      throw new Error(`Invalid player level. Must be one of: ${join(values(PlayerLevel), ', ')}`);
    }

    return this.playerRepository.update(id, data);
  }

  async deletePlayer(id: string): Promise<boolean> {
    const player = await this.playerRepository.findById(id);
    if (isNil(player)) {
      throw new Error('Player not found');
    }
    return this.playerRepository.delete(id);
  }

  async getPlayersByLevel(level: PlayerLevel): Promise<Player[]> {
    return this.playerRepository.findByLevel(level);
  }
}

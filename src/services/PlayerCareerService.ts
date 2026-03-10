import { isNil, isUndefined } from 'lodash';
import { PlayerCareerRepository } from '../repositories/PlayerCareerRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { LeagueRepository } from '../repositories/LeagueRepository';
import { PlayerCareer, CreatePlayerCareerDTO, UpdatePlayerCareerDTO } from '../models/PlayerCareer';
import { PlayerCareerWithDetails } from '../dto/PlayerCareerDto';

export class PlayerCareerService {
  constructor(
    private playerCareerRepository: PlayerCareerRepository,
    private playerRepository: PlayerRepository,
    private teamRepository: TeamRepository,
    private leagueRepository: LeagueRepository
  ) {}

  async createPlayerCareer(data: CreatePlayerCareerDTO): Promise<PlayerCareer> {
    const player = await this.playerRepository.findById(data.playerId);
    if (isNil(player)) {
      throw new Error('Player not found');
    }

    const team = await this.teamRepository.findById(data.teamId);
    if (isNil(team)) {
      throw new Error('Team not found');
    }

    const league = await this.leagueRepository.findById(data.leagueId);
    if (isNil(league)) {
      throw new Error('League not found');
    }

    if (data.yearEnd && data.yearEnd < data.yearStart) {
      throw new Error('End year cannot be before start year');
    }

    if (data.appearances < 0) {
      throw new Error('Appearances cannot be negative');
    }

    return this.playerCareerRepository.create(data);
  }

  async getPlayerCareerById(id: string): Promise<PlayerCareer | null> {
    return this.playerCareerRepository.findById(id);
  }

  async getAllPlayerCareers(): Promise<PlayerCareer[]> {
    return this.playerCareerRepository.findAll();
  }

  async updatePlayerCareer(id: string, data: UpdatePlayerCareerDTO): Promise<PlayerCareer | null> {
    const career = await this.playerCareerRepository.findById(id);
    if (isNil(career)) {
      throw new Error('Player career record not found');
    }

    if (data.playerId) {
      const player = await this.playerRepository.findById(data.playerId);
      if (isNil(player)) {
        throw new Error('Player not found');
      }
    }

    if (data.teamId) {
      const team = await this.teamRepository.findById(data.teamId);
      if (isNil(team)) {
        throw new Error('Team not found');
      }
    }

    if (data.leagueId) {
      const league = await this.leagueRepository.findById(data.leagueId);
      if (isNil(league)) {
        throw new Error('League not found');
      }
    }

    if (!isUndefined(data.appearances) && data.appearances < 0) {
      throw new Error('Appearances cannot be negative');
    }

    return this.playerCareerRepository.update(id, data);
  }

  async deletePlayerCareer(id: string): Promise<boolean> {
    const career = await this.playerCareerRepository.findById(id);
    if (isNil(career)) {
      throw new Error('Player career record not found');
    }
    return this.playerCareerRepository.delete(id);
  }

  async getPlayerCareersByPlayerId(playerId: string): Promise<PlayerCareer[]> {
    return this.playerCareerRepository.findByPlayerId(playerId);
  }

  async getPlayerCareersByTeamId(teamId: string): Promise<PlayerCareer[]> {
    return this.playerCareerRepository.findByTeamId(teamId);
  }

  async getPlayerCareersByLeagueId(leagueId: string): Promise<PlayerCareer[]> {
    return this.playerCareerRepository.findByLeagueId(leagueId);
  }

  async getPlayerCareerWithDetails(playerId: string): Promise<PlayerCareerWithDetails[]> {
    return this.playerCareerRepository.findPlayerCareerWithDetails(playerId);
  }
}

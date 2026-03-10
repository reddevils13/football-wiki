import { isEmpty, trim, get, isNil } from 'lodash';
import { LeagueRepository } from '../repositories/LeagueRepository';
import { League, CreateLeagueDTO, UpdateLeagueDTO } from '../models/League';

export class LeagueService {
  constructor(private leagueRepository: LeagueRepository) {}

  async createLeague(data: CreateLeagueDTO): Promise<League> {
    if (isEmpty(trim(get(data, 'leagueName', '')))) {
      throw new Error('League name is required');
    }
    return this.leagueRepository.create(data);
  }

  async getLeagueById(id: string): Promise<League | null> {
    return this.leagueRepository.findById(id);
  }

  async getAllLeagues(): Promise<League[]> {
    return this.leagueRepository.findAll();
  }

  async updateLeague(id: string, data: UpdateLeagueDTO): Promise<League | null> {
    const league = await this.leagueRepository.findById(id);
    if (isNil(league)) {
      throw new Error('League not found');
    }

    if (data.leagueName && isEmpty(trim(data.leagueName))) {
      throw new Error('League name cannot be empty');
    }

    return this.leagueRepository.update(id, data);
  }

  async deleteLeague(id: string): Promise<boolean> {
    const league = await this.leagueRepository.findById(id);
    if (isNil(league)) {
      throw new Error('League not found');
    }
    return this.leagueRepository.delete(id);
  }

  async searchLeaguesByName(name: string): Promise<League[]> {
    return this.leagueRepository.findByName(name);
  }
}

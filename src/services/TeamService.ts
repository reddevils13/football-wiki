import { isEmpty, trim, get, isNil } from 'lodash';
import { TeamRepository } from '../repositories/TeamRepository';
import { Team, CreateTeamDTO, UpdateTeamDTO } from '../models/Team';

export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async createTeam(data: CreateTeamDTO): Promise<Team> {
    if (isEmpty(trim(get(data, 'teamName', '')))) {
      throw new Error('Team name is required');
    }
    return this.teamRepository.create(data);
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getTeamsWithPlayers(): Promise<Team[]> {
    return this.teamRepository.findTeamsWithPlayers();
  }

  async updateTeam(id: string, data: UpdateTeamDTO): Promise<Team | null> {
    const team = await this.teamRepository.findById(id);
    if (isNil(team)) {
      throw new Error('Team not found');
    }

    if (data.teamName && isEmpty(trim(data.teamName))) {
      throw new Error('Team name cannot be empty');
    }

    return this.teamRepository.update(id, data);
  }

  async deleteTeam(id: string): Promise<boolean> {
    const team = await this.teamRepository.findById(id);
    if (isNil(team)) {
      throw new Error('Team not found');
    }
    return this.teamRepository.delete(id);
  }

  async searchTeamsByName(name: string): Promise<Team[]> {
    return this.teamRepository.findByName(name);
  }
}

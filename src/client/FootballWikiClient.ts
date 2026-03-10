import { ApiClient } from './ApiClient';
import { Player, CreatePlayerDTO, UpdatePlayerDTO } from '../models/Player';
import { Team, CreateTeamDTO, UpdateTeamDTO } from '../models/Team';
import { League, CreateLeagueDTO, UpdateLeagueDTO } from '../models/League';
import { Game, CreateGameDTO, UpdateGameDTO } from '../models/Game';
import { PlayerCareer, CreatePlayerCareerDTO, UpdatePlayerCareerDTO } from '../models/PlayerCareer';
import { GameWithCareerResponse, SubmitAnswerDTO, AnswerValidationResponse, GameAnswerResponse } from '../dto';

export class FootballWikiClient {
  private api: ApiClient;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.api = new ApiClient({ baseURL });
  }

  async hello(): Promise<{ message: string; timestamp: string; version: string }> {
    return this.api.get('/hello');
  }

  async health(): Promise<{ status: string; uptime: number }> {
    return this.api.get('/health');
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.api.get('/players');
  }

  async getPlayerById(id: string): Promise<Player> {
    return this.api.get(`/players/${id}`);
  }

  async createPlayer(data: CreatePlayerDTO): Promise<Player> {
    return this.api.post('/players', data);
  }

  async updatePlayer(id: string, data: UpdatePlayerDTO): Promise<Player> {
    return this.api.put(`/players/${id}`, data);
  }

  async deletePlayer(id: string): Promise<void> {
    return this.api.delete(`/players/${id}`);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.api.get('/teams');
  }

  async getTeamById(id: string): Promise<Team> {
    return this.api.get(`/teams/${id}`);
  }

  async createTeam(data: CreateTeamDTO): Promise<Team> {
    return this.api.post('/teams', data);
  }

  async updateTeam(id: string, data: UpdateTeamDTO): Promise<Team> {
    return this.api.put(`/teams/${id}`, data);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.api.delete(`/teams/${id}`);
  }

  async getAllLeagues(): Promise<League[]> {
    return this.api.get('/leagues');
  }

  async getLeagueById(id: string): Promise<League> {
    return this.api.get(`/leagues/${id}`);
  }

  async createLeague(data: CreateLeagueDTO): Promise<League> {
    return this.api.post('/leagues', data);
  }

  async updateLeague(id: string, data: UpdateLeagueDTO): Promise<League> {
    return this.api.put(`/leagues/${id}`, data);
  }

  async deleteLeague(id: string): Promise<void> {
    return this.api.delete(`/leagues/${id}`);
  }

  async getAllGames(): Promise<Game[]> {
    return this.api.get('/games');
  }

  async getGameById(id: string): Promise<Game> {
    return this.api.get(`/games/${id}`);
  }

  async createRandomGame(): Promise<GameWithCareerResponse> {
    return this.api.post('/games');
  }

  async validateAnswer(data: SubmitAnswerDTO): Promise<AnswerValidationResponse> {
    return this.api.post('/games/validate-answer', data);
  }

  async getGameAnswer(gameId: string): Promise<GameAnswerResponse> {
    return this.api.get(`/games/${gameId}/answer`);
  }

  async createGame(data: CreateGameDTO): Promise<Game> {
    return this.api.post('/games', data);
  }

  async updateGame(id: string, data: UpdateGameDTO): Promise<Game> {
    return this.api.put(`/games/${id}`, data);
  }

  async deleteGame(id: string): Promise<void> {
    return this.api.delete(`/games/${id}`);
  }

  async getAllPlayerCareers(): Promise<PlayerCareer[]> {
    return this.api.get('/player-careers');
  }

  async getPlayerCareerById(id: string): Promise<PlayerCareer> {
    return this.api.get(`/player-careers/${id}`);
  }

  async createPlayerCareer(data: CreatePlayerCareerDTO): Promise<PlayerCareer> {
    return this.api.post('/player-careers', data);
  }

  async updatePlayerCareer(id: string, data: UpdatePlayerCareerDTO): Promise<PlayerCareer> {
    return this.api.put(`/player-careers/${id}`, data);
  }

  async deletePlayerCareer(id: string): Promise<void> {
    return this.api.delete(`/player-careers/${id}`);
  }
}

export default FootballWikiClient;

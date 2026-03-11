import { isNil, isEmpty } from 'lodash';
import { GameRepository } from '../repositories/GameRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { PlayerCareerRepository } from '../repositories/PlayerCareerRepository';
import { Game, CreateGameDTO, UpdateGameDTO } from '../models/Game';
import { GameWithPlayerDetails, GameWithCareerResponse } from '../dto/GameDto';
import { SubmitAnswerDTO, AnswerValidationResponse, GameAnswerResponse } from '../dto/AnswerDto';

export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private playerRepository: PlayerRepository,
    private playerCareerRepository: PlayerCareerRepository
  ) {}

  async createRandomGame(level?: string): Promise<GameWithCareerResponse> {
    // Get one random player by level (if specified) directly from DB
    const randomPlayer = level 
      ? await this.playerRepository.getRandomPlayerByLevel(level)
      : await this.playerRepository.getRandomPlayer();
    
    if (isNil(randomPlayer)) {
      throw new Error('No players available to create a game');
    }

    // Create game without extra SELECT query
    const game = await this.gameRepository.create({
      playerId: randomPlayer.id
    });

    // Fetch career details with joins (already optimized)
    const careerDetails = await this.playerCareerRepository.findPlayerCareerWithDetails(randomPlayer.id);

    const playerCareer = careerDetails.map((career) => ({
      teamName: career.teamName,
      leagueName: career.leagueName,
      yearStart: career.yearStart,
      yearEnd: career.yearEnd,
      appearances: career.appearances
    }));

    return {
      gameId: game.id,
      playerCareer
    };
  }

  async createGame(data: CreateGameDTO): Promise<Game> {
    const player = await this.playerRepository.findById(data.playerId);
    if (isNil(player)) {
      throw new Error('Player not found');
    }

    return this.gameRepository.create(data);
  }

  async getGameById(id: string): Promise<Game | null> {
    return this.gameRepository.findById(id);
  }

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.findAll();
  }

  async updateGame(id: string, data: UpdateGameDTO): Promise<Game | null> {
    const game = await this.gameRepository.findById(id);
    if (isNil(game)) {
      throw new Error('Game not found');
    }

    if (data.playerId) {
      const player = await this.playerRepository.findById(data.playerId);
      if (isNil(player)) {
        throw new Error('Player not found');
      }
    }

    return this.gameRepository.update(id, data);
  }

  async deleteGame(id: string): Promise<boolean> {
    const game = await this.gameRepository.findById(id);
    if (isNil(game)) {
      throw new Error('Game not found');
    }
    return this.gameRepository.delete(id);
  }

  async getGamesByPlayerId(playerId: string): Promise<Game[]> {
    return this.gameRepository.findByPlayerId(playerId);
  }

  async getGamesWithPlayerDetails(playerId?: string): Promise<GameWithPlayerDetails[]> {
    return this.gameRepository.findGamesWithPlayerDetails(playerId);
  }

  async validateAnswer(data: SubmitAnswerDTO): Promise<AnswerValidationResponse> {
    const game = await this.gameRepository.findById(data.gameId);

    if (isNil(game)) {
      throw new Error('Game not found');
    }

    // Optimized: Removed unnecessary player validation query
    // We only need to check if the playerId matches, not if the player exists
    const isCorrect = game.playerId === data.playerId;

    if (isCorrect) {
      return {
        correct: true,
        message: 'Correct! You guessed the player correctly.',
        gameId: data.gameId,
        submittedPlayerId: data.playerId
      };
    } else {
      return {
        correct: false,
        message: 'Incorrect. The player you guessed is not correct.',
        gameId: data.gameId,
        submittedPlayerId: data.playerId
      };
    }
  }

  async getGameAnswer(gameId: string): Promise<GameAnswerResponse> {
    // Optimized: Single JOIN query instead of 2 sequential queries
    const result = await this.gameRepository.findGameWithPlayerById(gameId);

    if (isNil(result)) {
      throw new Error('Game not found');
    }

    return {
      gameId: result.id,
      playerId: result.playerId,
      playerName: result.playerName
    };
  }
}

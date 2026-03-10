import db from './db';
import { PlayerRepository } from './repositories/PlayerRepository';
import { TeamRepository } from './repositories/TeamRepository';
import { LeagueRepository } from './repositories/LeagueRepository';
import { PlayerCareerRepository } from './repositories/PlayerCareerRepository';
import { GameRepository } from './repositories/GameRepository';

import { PlayerService } from './services/PlayerService';
import { TeamService } from './services/TeamService';
import { LeagueService } from './services/LeagueService';
import { PlayerCareerService } from './services/PlayerCareerService';
import { GameService } from './services/GameService';

const playerRepository = new PlayerRepository(db);
const teamRepository = new TeamRepository(db);
const leagueRepository = new LeagueRepository(db);
const playerCareerRepository = new PlayerCareerRepository(db);
const gameRepository = new GameRepository(db);

export const playerService = new PlayerService(playerRepository);
export const teamService = new TeamService(teamRepository);
export const leagueService = new LeagueService(leagueRepository);
export const playerCareerService = new PlayerCareerService(
  playerCareerRepository,
  playerRepository,
  teamRepository,
  leagueRepository
);
export const gameService = new GameService(gameRepository, playerRepository, playerCareerRepository);

export {
  PlayerRepository,
  TeamRepository,
  LeagueRepository,
  PlayerCareerRepository,
  GameRepository,
  PlayerService,
  TeamService,
  LeagueService,
  PlayerCareerService,
  GameService
};

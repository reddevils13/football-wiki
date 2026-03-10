import { Game } from '../models/Game';
import { PlayerLevel } from '../models/Player';

export interface GameWithPlayerDetails extends Game {
  playerName: string;
  level: PlayerLevel;
}

export interface PlayerCareer {
  teamName: string;
  leagueName: string;
  yearStart: Date;
  yearEnd: Date | null;
  appearances: number;
}

export interface GameWithCareerResponse {
  gameId: string;
  playerCareer: Array<PlayerCareer>;
}

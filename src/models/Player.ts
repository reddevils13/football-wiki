export enum PlayerLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Player {
  id: string;
  playerName: string;
  level: PlayerLevel;
}

export interface CreatePlayerDTO {
  playerName: string;
  level: PlayerLevel;
}

export interface UpdatePlayerDTO {
  playerName?: string;
  level?: PlayerLevel;
}

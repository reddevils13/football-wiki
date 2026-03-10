export interface Game {
  id: string;
  playerId: string;
}

export interface CreateGameDTO {
  playerId: string;
}

export interface UpdateGameDTO {
  playerId?: string;
}

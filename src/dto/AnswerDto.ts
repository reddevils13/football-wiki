export interface SubmitAnswerDTO {
  gameId: string;
  playerId: string;
}

export interface AnswerValidationResponse {
  correct: boolean;
  message: string;
  gameId: string;
  submittedPlayerId: string;
}

export interface GameAnswerResponse {
  gameId: string;
  playerId: string;
  playerName: string;
}

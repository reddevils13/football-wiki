export interface League {
  id: string;
  leagueName: string;
}

export interface CreateLeagueDTO {
  leagueName: string;
}

export interface UpdateLeagueDTO {
  leagueName?: string;
}

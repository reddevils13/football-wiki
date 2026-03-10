export interface PlayerCareer {
  id: string;
  playerId: string;
  teamId: string;
  leagueId: string;
  yearStart: Date;
  yearEnd: Date | null;
  appearances: number;
}

export interface CreatePlayerCareerDTO {
  playerId: string;
  teamId: string;
  leagueId: string;
  yearStart: Date;
  yearEnd?: Date;
  appearances: number;
}

export interface UpdatePlayerCareerDTO {
  playerId?: string;
  teamId?: string;
  leagueId?: string;
  yearStart?: Date;
  yearEnd?: Date;
  appearances?: number;
}

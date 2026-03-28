export interface IplSchedule {
  id: string;
  startTime: Date;
  homeTeam: string;
  awayTeam: string;
  betBy?: string | null;
  betAt?: string | null; // Team name that person is betting on
  wonBy?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateIplScheduleDTO {
  startTime: Date;
  homeTeam: string;
  awayTeam: string;
  betBy?: string;
  betAt?: string; // Team name that person is betting on
  wonBy?: string;
}

export interface UpdateIplScheduleDTO {
  startTime?: Date;
  homeTeam?: string;
  awayTeam?: string;
  betBy?: string;
  betAt?: string; // Team name that person is betting on
  wonBy?: string;
}

export interface PatchIplScheduleDTO {
  betAt?: string; // Team name that person is betting on
  wonBy?: string; // Winner team name
}

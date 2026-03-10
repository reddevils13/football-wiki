export interface Team {
  id: string;
  teamName: string;
}

export interface CreateTeamDTO {
  teamName: string;
}

export interface UpdateTeamDTO {
  teamName?: string;
}

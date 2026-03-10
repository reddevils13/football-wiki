import { PlayerCareer } from '../models/PlayerCareer';

export interface PlayerCareerWithDetails extends PlayerCareer {
  teamName: string;
  leagueName: string;
}

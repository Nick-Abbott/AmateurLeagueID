import { TeamMemberRole } from '../../../models/TeamMember';

export interface UserMutable {
  username: string;
  description: string;
}

export interface TeamMutable {
  teamName: string;
  description: string;
}

export interface OrgMutable {
  orgName: string;
  description: string;
}

export interface TournamentMutable {
  tournamentName: string;
  description: string;
}

export interface TeamMemberMutable {
  role: TeamMemberRole;
  active: boolean;
}

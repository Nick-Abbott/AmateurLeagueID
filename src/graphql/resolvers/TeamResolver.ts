import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { Organization } from '../../models/Organization';
import { Team } from '../../models/Team';
import { TeamMember, TeamMemberRole } from '../../models/TeamMember';
import { User } from '../../models/User';
import { UpdateTeamInput } from '../types/input/mutateInputs/UpdateTeamInput';
import { SearchInput } from '../types/input/SearchInput';
import { SimpleTeam } from '../types/return/SimpleTeam';
import PostgresResolver from './PostgresResolver';

@Resolver(Team)
export class TeamResolver extends PostgresResolver {
  constructor() {
    super('team');
  }

  @Query(() => Team)
  async team(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return Team.findOne(id, { relations: this.relations(info, 'team') });
  }

  @Query(() => [SimpleTeam])
  async searchTeams(@Arg('params') params: SearchInput) {
    const teams = await Team.createQueryBuilder('team')
      .where('team.teamName ILIKE :teamName')
      .offset(params.page * params.limit)
      .limit(params.limit)
      .setParameter('teamName', `%${params.name}%`)
      .getMany();
    return teams;
  }

  @Mutation(() => Team)
  async createTeam(
    @Arg('teamName') teamName: string,
    @Arg('orgId', { nullable: true }) orgId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const team = Team.create({ teamName, organization: Organization.create({ id: orgId }) });
    const { id } = await team.save();
    return Team.findOne(id, { relations: this.relations(info, 'createTeam') });
  }

  @Mutation(() => Boolean)
  async deleteTeam(@Arg('id') id: string) {
    const team = await Team.findOne(id, { relations: ['tournaments'] });
    if (!team) return false;
    if (team.tournaments.length) throw new Error('Cannot delete team with tournament history');
    await team.remove();
    return true;
  }

  @Mutation(() => SimpleTeam)
  async updateTeam(@Arg('id') id: string, @Arg('params') params: UpdateTeamInput) {
    const team = await Team.findOne(id);
    if (!team) throw new Error('Team not found');
    const newTeam = Team.create({ id: team.id, ...params });
    return newTeam.save();
  }

  @Mutation(() => Team)
  async addMemberToTeam(
    @Arg('teamId') teamId: string,
    @Arg('userId') userId: string,
    @Arg('role') role: TeamMemberRole,
    @Info() info: GraphQLResolveInfo,
  ) {
    const team = await Team.findOne(teamId, { relations: ['members', 'members.user'] });
    if (!team) throw new Error('Team not found');
    const user = await User.findOne(userId);
    if (!user) throw new Error('User not found');
    if (!team.members.map(member => member.id).includes(teamId)) {
      await TeamMember.create({ user, team, role }).save();
    }
    return Team.findOne(teamId, { relations: this.relations(info, 'addMemberToTeam') });
  }

  @Mutation(() => Team)
  async removeMemberFromTeam(
    @Arg('teamId') teamId: string,
    @Arg('userId') userId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const teamMember = await TeamMember.findOne({ where: { user: userId, team: teamId } });
    if (teamMember) {
      await teamMember.remove();
    }
    return Team.findOne(teamId, { relations: this.relations(info, 'removeMemberFromTeam') });
  }
}

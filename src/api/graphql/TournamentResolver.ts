import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { Organization } from '../../models/Organization';
import { Team } from '../../models/Team';
import { Tournament } from '../../models/Tournament';
import PostgresResolver from './PostgresResolver';

@Resolver(Tournament)
export class TournamentResolver extends PostgresResolver {
  constructor() {
    super('tournament');
  }

  @Query(() => Tournament)
  async tournament(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return Tournament.findOne(id, { relations: this.relations(info, 'tournament') });
  }

  @Mutation(() => Tournament)
  async createTournament(
    @Arg('name') name: string,
    @Arg('organizationId') orgnizationId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const org = Organization.create({ id: orgnizationId });
    const tourney = Tournament.create({ tournamentName: name, organization: org });
    const { id } = await tourney.save();
    return Tournament.findOne(id, { relations: this.relations(info, 'createTournament') });
  }

  @Mutation(() => Tournament)
  async addTeam(
    @Arg('tournamentId') tourneyId: string,
    @Arg('teamId') teamId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const tourney = await Tournament.findOne(tourneyId, { relations: ['teams'] });
    if (tourney) {
      const team = Team.create({ id: teamId });
      tourney.teams.push(team);
      await tourney.save();
      return Tournament.findOne(tourneyId, { relations: this.relations(info, 'addTeam') });
    }
    throw new Error(`Tournament ${tourneyId} not found`);
  }

  @Mutation(() => Tournament)
  async removeTeam(
    @Arg('tournamentId') tourneyId: string,
    @Arg('teamId') teamId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const tourney = await Tournament.findOne(tourneyId, { relations: ['teams'] });
    if (tourney) {
      const newTeams = tourney.teams.filter(team => team.id !== teamId);
      if (newTeams.length !== tourney.teams.length) {
        tourney.teams = newTeams;
        await tourney.save();
      }
      return Tournament.findOne(tourneyId, { relations: this.relations(info, 'removeTeam') });
    }
    throw new Error(`Tournament ${tourneyId} not found`);
  }
}

import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Info, Mutation, Query, Resolver } from 'type-graphql';
import { Organization } from '../../models/Organization';
import { Team } from '../../models/Team';
import { Tournament } from '../../models/Tournament';
import PostgresResolver from './PostgresResolver';
import { CreateTournamentArgs } from '../types/create/CreateTournamentArgs';
import { UpdateTournamentInput } from '../types/input/mutateInputs/UpdateTournamentInput';
import { SearchInput } from '../types/input/SearchInput';
import { TournamentSearchFilters } from '../types/input/TournamentSearchFilters';
import { SimpleTournament } from '../types/return/SimpleTournament';

@Resolver(Tournament)
export class TournamentResolver extends PostgresResolver {
  constructor() {
    super('tournament');
  }

  @Query(() => Tournament)
  async tournament(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return Tournament.findOne(id, { relations: this.relations(info, 'tournament') });
  }

  @Query(() => [SimpleTournament])
  async searchForTournament(
    @Arg('params') params: SearchInput,
    @Arg('filters') filters: TournamentSearchFilters,
  ) {
    const queryBuilder = Tournament.createQueryBuilder('tourney')
      .where('tourney.tournamentName ILIKE :tourneyName', { tourneyName: `%${params.name}%` })
      .skip(params.page * params.limit)
      .take(params.limit);
    if (!filters.history) queryBuilder.andWhere('tourney.dateEnd > CURRENT_DATE');
    if (!filters.active) queryBuilder.andWhere('(tourney.dateStart < CURRENT_DATE OR tourney.dateEnd > CURRENT_DATE)');
    if (!filters.upcoming) queryBuilder.andWhere('tourney.dateStart > CURRENT_DATE');
    return queryBuilder.getMany();
  }

  @Mutation(() => Tournament)
  async createTournament(
    @Args() args: CreateTournamentArgs,
    @Info() info: GraphQLResolveInfo,
  ) {
    const org = Organization.create({ id: args.orgnizationId });
    const tourney = Tournament.create({
      tournamentName: args.name,
      organization: org,
      dateStart: args.startDate,
      dateEnd: args.endDate,
    });
    const { id } = await tourney.save();
    return Tournament.findOne(id, { relations: this.relations(info, 'createTournament') });
  }

  @Mutation(() => Boolean)
  async removeTournament(@Arg('id') id: string) {
    const tournament = await Tournament.findOne(id);
    if (!tournament) return false;
    await tournament.remove();
    return true;
  }

  @Mutation(() => Tournament)
  async updateTournament(
    @Arg('id') id: string,
    @Arg('params') params: UpdateTournamentInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    const tourney = await Tournament.findOne(id);
    if (!tourney) throw new Error('Tournament not found');
    await Tournament.create({ id: tourney.id, ...params }).save();
    return Tournament.findOne(id, { relations: this.relations(info, 'updateTournament') });
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

import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { getRelations, parsers } from '../../helpers/ParseRelationsHelper';
import { Organization } from '../../models/Organization';
import { Tournament } from '../../models/Tournament';
import { User } from '../../models/User';

@Resolver(Tournament)
export class TournamentResolver {
  @Query(() => Tournament)
  async tournament(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return this.loadTournament(id, info, 'tournament');
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
    return this.loadTournament(id, info, 'createTournament');
  }

  @Mutation(() => Tournament)
  async addPlayer(
    @Arg('tournamentId') tourneyId: string,
    @Arg('playerId') playerId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const tourney = await Tournament.findOne(tourneyId, { relations: ['players'] });
    if (tourney) {
      const user = User.create({ id: playerId });
      tourney.players.push(user);
      await tourney.save();
      return this.loadTournament(tourneyId, info, 'addPlayer');
    }
    throw new Error(`Tournament ${tourneyId} not found`);
  }

  @Mutation(() => Tournament)
  async removePlayer(
    @Arg('tournamentId') tourneyId: string,
    @Arg('playerId') playerId: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    const tourney = await Tournament.findOne(tourneyId, { relations: ['players'] });
    if (tourney) {
      const newPlayers = tourney.players.filter(user => user.id !== playerId);
      if (newPlayers.length !== tourney.players.length) {
        tourney.players = newPlayers;
        await tourney.save();
        return tourney.reload();
      }
      return this.loadTournament(tourneyId, info, 'removePlayer');
    }
    throw new Error(`Tournament ${tourneyId} not found`);
  }

  private loadTournament(id: string, info: GraphQLResolveInfo, funcName: string) {
    const relations = getRelations(info, funcName, parsers.parseTourneyRelations);
    return Tournament.findOne(id, { relations });
  }
}

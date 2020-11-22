import { Field, InterfaceType } from 'type-graphql';
import { Profile } from '../../../models/Profile';
import { TournamentMutable } from '../rawInterfaces/Mutables';

@InterfaceType({ implements: Profile })
export abstract class SimpleTournament extends Profile implements TournamentMutable {
  @Field()
  tournamentName: string;
}

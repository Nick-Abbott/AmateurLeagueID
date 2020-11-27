import { GraphQLDate } from 'graphql-iso-date';
import { Field, InterfaceType } from 'type-graphql';
import { Profile } from '../../../models/Profile';
import { TournamentMutable } from '../rawInterfaces/Mutables';

@InterfaceType({ implements: Profile })
export abstract class SimpleTournament extends Profile implements TournamentMutable {
  @Field()
  tournamentName: string;

  @Field(() => GraphQLDate)
  dateStart: string;

  @Field(() => GraphQLDate, { nullable: true })
  dateEnd: string;

  @Field(() => Boolean)
  get active() {
    return this.dateEnd === null || new Date() < new Date(this.dateEnd);
  }
}

import { Field, InputType } from 'type-graphql';
import { TournamentMutable } from '../../rawInterfaces/Mutables';

@InputType()
export class UpdateTournamentInput implements TournamentMutable {
  @Field({ nullable: true })
  tournamentName: string;

  @Field({ nullable: true })
  description: string;
}

import { Field, InputType } from 'type-graphql';
import { TeamMutable } from '../../rawInterfaces/Mutables';

@InputType()
export class UpdateTeamInput implements TeamMutable {
  @Field({ nullable: true })
  teamName: string;

  @Field({ nullable: true })
  description: string;
}

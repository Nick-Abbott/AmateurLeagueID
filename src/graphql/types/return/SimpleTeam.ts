import { Field, InterfaceType } from 'type-graphql';
import { Profile } from '../../../models/Profile';
import { TeamMutable } from '../rawInterfaces/Mutables';

@InterfaceType({ implements: Profile })
export abstract class SimpleTeam extends Profile implements TeamMutable {
  @Field()
  teamName: string;
}

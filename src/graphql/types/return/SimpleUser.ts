import { Field, InterfaceType } from 'type-graphql';
import { Profile } from '../../../models/Profile';
import { UserMutable } from '../rawInterfaces/Mutables';

@InterfaceType({ implements: Profile })
export abstract class SimpleUser extends Profile implements UserMutable {
  @Field()
  username: string;
}

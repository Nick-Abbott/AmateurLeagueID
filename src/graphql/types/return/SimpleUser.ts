import { Field, ID, InterfaceType } from 'type-graphql';
import { UserMutable } from '../rawInterfaces/Mutables';

@InterfaceType()
export abstract class SimpleUser implements UserMutable {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;
}

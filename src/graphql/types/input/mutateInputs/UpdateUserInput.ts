import { Field, InputType } from 'type-graphql';
import { UserMutable } from '../../rawInterfaces/Mutables';

@InputType()
export class UpdateUserInput implements UserMutable {
  @Field({ nullable: true })
  username: string;
}

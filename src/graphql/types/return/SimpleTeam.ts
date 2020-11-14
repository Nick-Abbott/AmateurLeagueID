import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class SimpleTeam {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

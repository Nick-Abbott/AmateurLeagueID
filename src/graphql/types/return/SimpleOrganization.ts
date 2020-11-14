import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class SimpleOrganization {
  @Field(() => ID)
  id: string;

  @Field()
  orgName: string;
}

import { GraphQLDate } from 'graphql-iso-date';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateTournamentArgs {
  @Field()
  name: string;

  @Field()
  orgnizationId: string;

  @Field(() => GraphQLDate)
  startDate: string;

  @Field(() => GraphQLDate, { nullable: true })
  endDate: string;
}

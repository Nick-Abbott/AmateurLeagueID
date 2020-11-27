import { Field, InputType } from 'type-graphql';

@InputType()
export class TournamentSearchFilters {
  @Field({ defaultValue: true })
  upcoming: boolean;

  @Field({ defaultValue: true })
  active: boolean;

  @Field({ defaultValue: false })
  history: boolean;
}

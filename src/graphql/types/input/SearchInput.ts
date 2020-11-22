import { Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class SearchInput {
  @Field({ description: 'Partial name to search for' })
  name: string;

  @Field(() => Int, { defaultValue: 10, description: 'Maximum number of returned results' })
  @Min(1)
  limit: number;

  @Field(() => Int, { defaultValue: 0, description: 'Offset * limit. Page of your results' })
  @Min(0)
  page: number;
}

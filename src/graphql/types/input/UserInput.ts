import { IsNumberString, IsUUID, Length } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserInput {
  @Field({ nullable: true })
  @IsUUID('4')
  id: string;

  @Field({ nullable: true })
  @Length(18, 18)
  @IsNumberString()
  discordId: string;
}

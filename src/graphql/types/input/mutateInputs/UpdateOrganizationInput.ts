import { Field, InputType } from 'type-graphql';
import { OrgMutable } from '../../rawInterfaces/Mutables';

@InputType()
export class UpdateOrganizationInput implements OrgMutable {
  @Field({ nullable: true })
  orgName: string;

  @Field({ nullable: true })
  description: string;
}

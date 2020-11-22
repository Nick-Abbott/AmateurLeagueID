import { Field, InterfaceType } from 'type-graphql';
import { Profile } from '../../../models/Profile';
import { OrgMutable } from '../rawInterfaces/Mutables';

@InterfaceType({ implements: Profile })
export abstract class SimpleOrganization extends Profile implements OrgMutable {
  @Field()
  orgName: string;
}

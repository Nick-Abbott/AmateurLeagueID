import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { Organization } from '../../models/Organization';
import PostgresResolver from './PostgresResolver';

@Resolver(Organization)
export class OrganizationResolver extends PostgresResolver {
  constructor() {
    super('organization');
  }

  @Query(() => Organization)
  async organization(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return Organization.findOne(id, { relations: this.relations(info, 'organization') });
  }

  @Mutation(() => Organization)
  async createOrganization(@Arg('name') name: string, @Info() info: GraphQLResolveInfo) {
    const org = Organization.create({ orgName: name });
    const { id } = await org.save();
    return Organization.findOne(id, { relations: this.relations(info, 'createOrganization') });
  }
}

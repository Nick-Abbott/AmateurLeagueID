import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { getRelations, parsers } from '../../helpers/ParseRelationsHelper';
import { Organization } from '../../models/Organization';

@Resolver(Organization)
export class OrganizationResolver {
  @Query(() => Organization)
  async organization(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    const relations = getRelations(info, 'organization', parsers.parseOrgRelations);
    return Organization.findOne(id, { relations });
  }

  @Mutation(() => Organization)
  async createOrganization(@Arg('name') name: string, @Info() info: GraphQLResolveInfo) {
    const relations = getRelations(info, 'organization', parsers.parseOrgRelations);
    const org = new Organization();
    org.orgName = name;
    const { id } = await org.save();
    return Organization.findOne(id, { relations });
  }
}

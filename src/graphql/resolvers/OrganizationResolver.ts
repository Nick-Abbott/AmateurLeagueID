import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Mutation, Query, Resolver } from 'type-graphql';
import { Organization } from '../../models/Organization';
import { UpdateOrganizationInput } from '../types/input/mutateInputs/UpdateOrganizationInput';
import { SimpleOrganization } from '../types/return/SimpleOrganization';
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

  @Mutation(() => Boolean)
  async deleteOrganization(@Arg('id') id: string) {
    const org = await Organization.findOne(id, { relations: ['tournaments', 'teams'] });
    if (!org) return false;
    if (org.tournaments.length) throw new Error('Can\'t delete organization with associated tournaments');
    if (org.teams.length) throw new Error('Can\'t delete organization with associated teams');
    await org.remove();
    return true;
  }

  @Mutation(() => SimpleOrganization)
  async updateOrganization(@Arg('id') id: string, @Arg('params') params: UpdateOrganizationInput) {
    const org = await Organization.findOne(id);
    if (!org) throw new Error('Organization not found');
    const newOrg = Organization.create({ id: org.id, ...params });
    return newOrg.save();
  }
}

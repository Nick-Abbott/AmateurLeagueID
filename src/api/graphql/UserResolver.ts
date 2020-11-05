import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Query, Resolver } from 'type-graphql';
import { getRelations, parsers } from '../../helpers/ParseRelationsHelper';
import { User } from '../../models/User';

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async user(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    return User.findOne(id, { relations: getRelations(info, 'user', parsers.parseUserRelations) });
  }
}

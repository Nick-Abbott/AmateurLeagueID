import { GraphQLResolveInfo } from 'graphql';
import { Arg, Info, Query, Resolver } from 'type-graphql';
import { User } from '../../models/User';
import PostgresResolver from './PostgresResolver';

@Resolver(User)
export class UserResolver extends PostgresResolver {
  constructor() {
    super('user');
  }

  @Query(() => User)
  async user(@Arg('id') id: string, @Info() info: GraphQLResolveInfo) {
    try {
      const user = await User.findOne(id, { relations: this.relations(info, 'user') });
      console.log(user);
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

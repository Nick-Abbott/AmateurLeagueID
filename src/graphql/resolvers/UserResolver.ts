import { GraphQLResolveInfo } from 'graphql';
import { Arg, Args, Info, Query, Resolver } from 'type-graphql';
import { UserIdsInput } from '../types/input/UserIdsInput';
import { SimpleUser } from '../types/return/SimpleUser';
import { User } from '../../models/User';
import PostgresResolver from './PostgresResolver';
import { SearchInput } from '../types/input/SearchInput';

@Resolver(User)
export class UserResolver extends PostgresResolver {
  constructor() {
    super('user');
  }

  @Query(() => User)
  async user(@Args() user: UserIdsInput, @Info() info: GraphQLResolveInfo) {
    try {
      const args: Partial<{ id: string, discordId: string }> = {};
      if (user.id) args.id = user.id;
      if (user.discordId) args.discordId = user.discordId;
      const foundUser = await User.findOne({
        where: args,
        relations: this.relations(info, 'user'),
      });
      console.log(foundUser);
      return foundUser;
    } catch (err) {
      console.error('ERROR');
      return null;
    }
  }

  @Query(() => [SimpleUser])
  async searchForUser(@Arg('params') params: SearchInput) {
    const users = await User.createQueryBuilder('user')
      .where('user.username ILIKE :username')
      .offset(params.page * params.limit)
      .limit(params.limit)
      .setParameter('username', `%${params.name}%`)
      .getMany();
    return users;
  }
}

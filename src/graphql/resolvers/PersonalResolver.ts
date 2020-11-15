import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../models/User';
import Context from '../GraphQLContext';
import { UpdateUserInput } from '../types/input/mutateInputs/UpdateUserInput';
import { SimpleUser } from '../types/return/SimpleUser';
import PostgresResolver from './PostgresResolver';

@Resolver(User)
export class PersonalResolver extends PostgresResolver {
  constructor() {
    super('user');
  }

  @Query(() => User, { nullable: true })
  async me(@Info() info: GraphQLResolveInfo, @Ctx() context: Context) {
    if (!context.user) {
      return null;
    }
    try {
      const user = await User.findOne(context.user.id, { relations: this.relations(info, 'me') });
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  @Mutation(() => SimpleUser)
  async updateSelf(@Arg('user') user: UpdateUserInput, @Ctx() context: Context) {
    if (!context.user) {
      return null;
    }
    try {
      const newUser = User.create({ id: context.user.id, ...user });
      return newUser.save();
    } catch (err) {
      return null;
    }
  }
}

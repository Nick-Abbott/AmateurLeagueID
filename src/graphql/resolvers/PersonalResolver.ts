import { GraphQLResolveInfo } from 'graphql';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../models/User';
import Context from '../GraphQLContext';
import { UpdateUserInput } from '../types/input/mutateInputs/UpdateUserInput';
import PostgresResolver from './PostgresResolver';
import NotLoggedInException from '../../exceptions/authentication/NotLoggedInException';

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
    return User.findOne(context.user.id, { relations: this.relations(info, 'me') });
  }

  @Mutation(() => User)
  async updateSelf(@Arg('user') params: UpdateUserInput, @Info() info: GraphQLResolveInfo, @Ctx() context: Context) {
    if (!context.user) {
      throw new NotLoggedInException();
    }
    await User.create({ id: context.user.id, ...params }).save();
    return User.findOne(context.user.id, { relations: this.relations(info, 'updateSelf') });
  }
}

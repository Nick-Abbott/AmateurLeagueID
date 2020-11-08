import { GraphQLResolveInfo } from 'graphql';
import { getRelations, TMappings } from '../../helpers/ParseRelationsHelper';

export default abstract class PostgresResolver {
  private name: keyof TMappings;

  constructor(name: keyof TMappings) {
    this.name = name;
  }

  protected relations(info: GraphQLResolveInfo, funcName: keyof this) {
    return getRelations(info, funcName as string, this.name);
  }
}

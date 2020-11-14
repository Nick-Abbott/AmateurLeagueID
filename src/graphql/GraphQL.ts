import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolvers/UserResolver';
import { OrganizationResolver } from './resolvers/OrganizationResolver';
import { TournamentResolver } from './resolvers/TournamentResolver';
import { PersonalResolver } from './resolvers/PersonalResolver';

export class GraphQL {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public async init() {
    const schema = await buildSchema({
      resolvers: [UserResolver, TournamentResolver, OrganizationResolver, PersonalResolver],
      emitSchemaFile: true,
      authMode: 'null',
    });

    const server = new ApolloServer({
      schema,
      context: ({ req }) => ({ user: req.user }),
    });
    server.applyMiddleware({ app: this.app });
  }
}

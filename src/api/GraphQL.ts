import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './graphql/UserResolver';
import { OrganizationResolver } from './graphql/OrganizationResolver';
import { TournamentResolver } from './graphql/TournamentResolver';

export class GraphQL {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public async init() {
    const schema = await buildSchema({
      resolvers: [UserResolver, TournamentResolver, OrganizationResolver],
      emitSchemaFile: true,
    });

    const server = new ApolloServer({ schema });
    server.applyMiddleware({ app: this.app });
  }
}

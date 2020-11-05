import express, { Router } from 'express';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import redis from 'redis';
import RedisStore from 'connect-redis';
import bodyParser from 'body-parser';
import passport from 'passport';
import { GraphQL } from './GraphQL';

require('./authentication/PassportAuth');

export interface IRouter {
  router: Router,
  routeName: string,
}

const SECRET = 'hFqjXX0U1f';

export default class Restful {
  private app: express.Application;
  private port: number;
  private server: Server | undefined;

  constructor(port = 3000) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(session({
      secret: SECRET,
      resave: false,
      cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 777600000 /* 9 days */ },
      saveUninitialized: false,
      store: new (RedisStore(session))({ client: redis.createClient() }),
    }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.port = port;
  }

  private async loadRouters() {
    const graphQL = new GraphQL(this.app);
    await graphQL.init();
    await new Promise<void>((resolve, reject) => {
      fs.readdir(path.join(__dirname, 'routers'), 'utf8', (err, files) => {
        if (err) return reject(err);
        files.forEach((file) => {
          if (file.endsWith('.js')) {
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const { routeName, router }: IRouter = require(`./routers/${file}`).default;
            this.app.use(routeName, router);
          }
        });
        return resolve();
      });
    });
  }

  public async start(): Promise<void> {
    await this.loadRouters();
    await new Promise<void>((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Listening on port ${this.port}`);
        return resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    await new Promise<void>((resolve) => {
      if (!this.server) return resolve();
      return this.server.close((err) => {
        if (err && this.server) {
          console.log('Closure failed');
          this.server.unref();
          delete this.server;
        }
        console.log('Server stopped');
        return resolve();
      });
    });
  }
}

/* eslint-disable import/first */
// eslint-disable-next-line import/newline-after-import
import { config } from 'dotenv';
config(); // Set up dotenv config

import { createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import Restful from './api/Restful';

const getPostgresConnectionOptions: () => Promise<PostgresConnectionOptions> = async () => {
  const defaultOpts = await getConnectionOptions() as PostgresConnectionOptions;
  return {
    ...defaultOpts,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DATABASE || 'default',
  };
};

(async () => {
  const connection = await createConnection(await getPostgresConnectionOptions());
  const restful = new Restful();
  await restful.start();
  process.on('SIGINT', async () => {
    await restful.stop();
    await connection.close();
  });
})();

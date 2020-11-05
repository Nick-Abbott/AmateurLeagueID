import PostgresException from './PostgesException';

export default class PostgresDataNotFoundException extends PostgresException {
  public readonly id: string;

  constructor(id: string) {
    super('PostgresDataDataNotFound', `Postgres data not found for id: ${id}`, 404);
    this.id = id;
  }
}

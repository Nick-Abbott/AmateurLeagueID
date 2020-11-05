import PostgresException from './PostgesException';

export default class PostgresDataExistsException extends PostgresException {
  public readonly id: string;

  constructor(id: string) {
    super('PostgresDataExists', `Postgres data already exists for id: ${id}`, 409);
    this.id = id;
  }
}

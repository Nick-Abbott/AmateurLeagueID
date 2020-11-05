import Exception from '../Exception';

export default class PostgresException extends Exception {
  constructor(name: string, message: string, code: number) {
    super(name, message, code, 'postgres');
  }
}

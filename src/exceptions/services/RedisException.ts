import Exception from '../Exception';

export default class RedisException extends Exception {
  constructor(name: string, message: string, code: number) {
    super(name, message, code, 'redis');
  }
}

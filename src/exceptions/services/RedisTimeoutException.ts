import RedisException from './RedisException';

export default class RedisTimeoutException extends RedisException {
  constructor() {
    super('RedisTimeout', 'Redis timed out', 502);
  }
}

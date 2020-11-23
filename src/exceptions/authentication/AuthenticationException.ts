import Exception from '../Exception';

export default class AuthenticationException extends Exception {
  constructor(name: string, message: string, code: number) {
    super(name, message, code, 'authentication');
  }
}

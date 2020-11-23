import AuthenticationException from './AuthenticationException';

export default class NotLoggedInException extends AuthenticationException {
  constructor() {
    super('NotLoggedIn', 'User session cookies are missing or invalid', 401);
  }
}

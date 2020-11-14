import { TDiscordProfile } from '../api/authentication/DiscordOAuth2Strategy';

export default interface Context {
  user: TDiscordProfile;
}

/* eslint-disable no-underscore-dangle */
import OAuth2Strategy, { InternalOAuthError, VerifyCallback } from 'passport-oauth2';
import { User } from '../../models/User';

type TDiscordUserResponse = {
  id: string,
  username: string,
  avatar: string,
  discriminator: string,
  public_flags: number,
  flags: number,
  locale: string,
  mfa_enabled: boolean,
};

export type TDiscordProfile = {
  accessToken: string,
  id: string,
  username: string,
};

const API_URL = 'https://discord.com/api';
const clientID = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';

export class DiscordOAuth2Strategy extends OAuth2Strategy {
  constructor() {
    super({
      clientID,
      clientSecret,
      authorizationURL: `${API_URL}/oauth2/authorize`,
      tokenURL: `${API_URL}/oauth2/token`,
      callbackURL: `http://${process.env.HOST_URL || 'localhost:3000'}/redirect`,
      scopeSeparator: ' ',
      scope: 'identify',
    }, async (accessToken: string, refreshToken: string, profile: TDiscordUserResponse, cb: VerifyCallback) => {
      let user = await User.findOne({ where: { discordId: profile.id } });
      if (!user) {
        user = await User.create({
          discordId: profile.id,
          username: profile.username,
        }).save();
      }
      cb(null, { accessToken, refreshToken, id: user.id });
    });
    this.name = 'discord';
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  public async userProfile(accessToken: string, done: (err?: Error | null, profile?: TDiscordProfile) => void) {
    const { id, username } = await this.getDiscordAccountInfo(accessToken);
    done(null, { id, username, accessToken });
  }

  public async getDiscordAccountInfo(accessToken: string) {
    return new Promise<TDiscordUserResponse>((resolve, reject) => {
      this._oauth2.get(`${API_URL}/users/@me`, accessToken, (err, body) => {
        if (err) return reject(new InternalOAuthError('Failed to fetch user profile', err));
        return resolve(JSON.parse(body as string));
      });
    });
  }

  public authorizationParams() {
    return { prompt: 'none' };
  }
}

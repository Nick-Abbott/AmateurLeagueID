import passport from 'passport';
import { DiscordOAuth2Strategy } from './DiscordOAuth2Strategy';

passport.use(new DiscordOAuth2Strategy());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

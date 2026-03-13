import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: env.google.callbackUrl,
    },
    (accessToken, refreshToken, profile, done) => {
      // Pass the profile through as the user object.
      // Cast to any then to Express.User to satisfy Passport's internal type expectations
      return done(null, profile as any as Express.User);
    }
  )
);

export default passport;

import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Function
    ) => {
      return done(null, { profile, accessToken });
    }
  )
);

export default passport;
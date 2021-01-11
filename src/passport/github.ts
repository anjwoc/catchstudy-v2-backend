import passport from "passport";
import github from "passport-github";
import dotenv from "dotenv";
dotenv.config();

const GithubStrategy = github.Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const GithubModule = () =>
  passport.use(
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID!,
        clientSecret: GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.API_SERVER}/auth/github/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
      },
    ),
  );

export default GithubModule;

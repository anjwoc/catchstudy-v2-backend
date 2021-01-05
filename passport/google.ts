import passport from "passport";
import google from "passport-google-oauth";
import dotenv from "dotenv";
dotenv.config();
const GoogleStrategy = google.OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GoogleModule = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID!,
        clientSecret: GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.API_SERVER}/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
      },
    ),
  );
};

export default GoogleModule;

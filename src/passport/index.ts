import passport from "passport";
import dotenv from "dotenv";
import User from "../models/user";
import Post from "../models/post";

import local from "./local";
dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

interface LoginOptions {
  provider?: string;
  id?: string;
}

export default () => {
  passport.serializeUser((user: User, done) => {
    return done(null, user);
  });

  passport.deserializeUser(async (opt: LoginOptions, done) => {
    try {
      let where = {};
      if (opt.provider) {
        where = {
          socialType: opt.provider,
          openId: opt.id,
        };
      } else {
        where = {
          id: opt.id,
        };
      }
      const user = await User.findOne({
        where,
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
        ],
      });

      if (!user) {
        return new Error("no user");
      }
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  local();
};

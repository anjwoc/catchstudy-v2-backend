import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import User from "../models/user";
import GithubModule from "./github";
import GoogleModule from "./google";

export default () => {
  GithubModule();
  GoogleModule();
  passport.use(
    "local",
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (!exUser) {
            return done(null, false, {
              message: "존재하지 않는 사용자입니다.",
            });
          }
          const result = await bcrypt.compare(password, exUser.password);
          if (result) {
            return done(null, exUser);
          } else {
            return done(null, false, { message: "비밀번호가 틀립니다." });
          }
        } catch (err) {
          console.error(err);
          return done(err);
        }
      },
    ),
  );
};

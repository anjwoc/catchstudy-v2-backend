const passport = require("passport");
// const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const local = require("./local");
const dotenv = require("dotenv");
const db = require("../models");

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = () => {
  passport.serializeUser((user, done) => {
    //로그인 성공했을 시
    return done(null, user);
  });

  passport.deserializeUser(async (obj, done) => {
    //서버로 들어오는 요청마다 세션정보를 디비랑 비교
    try {
      let where = {};
      if (obj.provider) {
        where = {
          socialType: obj.provider,
          openId: obj.id,
        };
      } else {
        where = {
          id: obj.id,
        };
      }
      const user = await db.User.findOne({
        where,
        attributes: ["id", "email", "name", "about", "job", "location", "imgSrc", "socialType", "createdAt"],
        include: [
          {
            model: db.Post,
            attributes: ["id"],
          },
        ],
      });
      return done(null, user); // req.user, req.isAuthenticated() === true,
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_SERVER}/auth/github/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
      },
    ),
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_SERVER}/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
      },
    ),
  );

  // passport.use(new FacebookStrategy({
  //   clientID: "",
  //   clientSecret: "",
  //   profileFields: ['id', 'displayName', 'photos'],
  //   callbackURL: ''
  // }, (accessToken, refreshToken, profile, done) => {
  //   const socialId = profile.id;
  //   const nickname = profile.displayName;
  //   const profileImageUrl = profile.photos[0].value;

  //   onLoginSuccess('Facebook', socialId, nickname, profileImageUrl, done);
  // }));

  local();
};

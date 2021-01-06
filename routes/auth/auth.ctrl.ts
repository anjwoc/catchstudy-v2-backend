import { db, IUser } from "../../models";
import dotenv from "dotenv";
import { RequestHandler } from "express";
dotenv.config();

const githubLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, socialType } = req.body;
    const loginUser = await db.User.findOne({
      where: {
        email: email,
        socialType: socialType,
      },
      attributes: ["id", "email", "socialType", "name", "about", "imgSrc"],
      include: [
        {
          model: db.Post,
          attributes: ["id"],
        },
      ],
    });
    res.json(loginUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const githubCallback: RequestHandler = async (req, res, next) => {
  try {
    const json = req!.user!["_json"];
    const { id, displayName, username, profileUrl, email, avatar_url, provider, bio, location, company } = json;
    const userInfo = {
      id: id,
      displayName: displayName,
      name: username,
      profileUrl: profileUrl,
      email: email,
      photo: avatar_url,
      provider: provider,
      about: bio,
      location: location,
      job: company,
    };

    const exUser = await db.User.findOne({
      where: {
        email: userInfo.email,
      },
    });

    if (exUser && exUser.socialType == null) {
      // 일반 회원가입으로 이미 가입한 유저 로그인 진행

      await db.User.findOrCreate({
        where: { openId: userInfo.id },
        defaults: {
          openId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          socialType: userInfo.provider,
          imgSrc: userInfo.photo,
          location: userInfo.location,
          about: userInfo.about,
          job: userInfo.job,
        },
      });

      return res.redirect(`${process.env.CLIENT_HOST}`);
    } else {
      // 가입한 다른 소셜 계정의 이메일이 같은 경우
      const msg = encodeURIComponent("이미 가입된 이메일 계정입니다.");
      return res.redirect(`${process.env.CLIENT_HOST}/login?error=${msg}`);
    }
  } catch (err) {
    console.error(err);
  }
};

const googleCallback: RequestHandler = async (req, res, next) => {
  try {
    const json = req!.user!["_json"];
    const { id, displayName, picture, email, provider } = json;
    const userInfo = {
      id: id,
      name: displayName,
      photo: picture,
      email: email,
      provider: provider,
    };
    const exUser = await db.User.findOne({
      where: {
        email: userInfo.email,
      },
    });
    if (exUser && exUser.socialType == null) {
      // 일반 회원가입으로 이미 가입했으면 socialLogin으로 update
      await db.User.update(
        {
          openId: userInfo.id,
          socialType: userInfo.provider,
          imgSrc: userInfo.photo,
        },
        {
          where: { openId: userInfo.id },
        },
      );

      return res.redirect(`${process.env.CLIENT_HOST}`);
    }
    await db.User.findOrCreate({
      where: { openId: userInfo.id },
      defaults: {
        openId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        socialType: userInfo.provider,
        imgSrc: userInfo.photo,
        location: "",
        about: "",
        job: "",
      },
    });

    return res.redirect(`${process.env.CLIENT_HOST}`);
  } catch (err) {
    console.error(err);
  }
};

export default {
  googleCallback,
  githubCallback,
  githubLogin,
};

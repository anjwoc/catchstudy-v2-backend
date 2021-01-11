import { db, IUser } from "../../models";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
dotenv.config();

const githubLogin = async (req, res, next) => {
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

const githubCallback = async (req, res, next) => {
  try {
    const json = req!.user!["_json"];
    const { id, name, email, avatar_url, bio, location, company } = json;
    const userInfo = {
      id: id,
      name: name,
      email: email,
      photo: avatar_url,
      provider: "github",
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
      await db.User.update(
        {
          openId: userInfo.id,
          socialType: userInfo.provider,
          imgSrc: userInfo.photo,
          about: userInfo.about,
          job: userInfo.job,
        },
        {
          where: { openId: userInfo.id },
        },
      );
      return res.redirect(`${process.env.CLIENT_HOST}`);
    }

    const password = userInfo.id.toString().slice(4) + Math.random().toString(36).substr(2, 8);
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.User.findOrCreate({
      where: { openId: userInfo.id },
      defaults: {
        openId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        socialType: userInfo.provider,
        imgSrc: userInfo.photo,
        password: hashedPassword,
        location: userInfo.location,
        about: userInfo.about,
        job: userInfo.job,
      },
    });
    return res.redirect(`${process.env.CLIENT_HOST}`);
  } catch (err) {
    console.error(err);
  }
};

const googleCallback = async (req, res, next) => {
  try {
    const user = req?.user;
    const json = user!["_json"];
    const { id, displayName, provider } = user;
    const { picture, email } = json;
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
    const password = userInfo.id.slice(8) + Math.random().toString(36).substr(2, 8);
    const hashedPassword = await bcrypt.hash(password, 12);
    await db.User.findOrCreate({
      where: { openId: userInfo.id },
      defaults: {
        openId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        socialType: userInfo.provider,
        imgSrc: userInfo.photo,
        password: hashedPassword,
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

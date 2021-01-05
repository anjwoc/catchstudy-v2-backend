const db = require("../../models");
require("dotenv").config();

exports.githubLogin = async (req, res, next) => {
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
        {
          model: db.Media,
          attributes: ["github", "gmail", "facebook", "userId"],
        },
      ],
    });
    res.json(loginUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.githubCallback = async (req, res, next) => {
  try {
    const json = req.user._json;
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
      await db.User.update({
        openId: userInfo.id,
        socialType: userInfo.provider,
        imgSrc: userInfo.photo,
        location: userInfo.location,
        about: userInfo.about,
        job: userInfo.job,
      });
      return res.redirect(`${process.env.CLIENT_HOST}`);
    } else {
      // 가입한 다른 소셜 계정의 이메일이 같은 경우
      const msg = encodeURIComponent("이미 가입된 이메일 계정입니다.");
      return res.redirect(`${process.env.CLIENT_HOST}/login?error=${msg}`);
    }
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
  } catch (err) {
    console.error(err);
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    const data = res.req.user;
    const userInfo = {
      id: data.id,
      name: data.displayName,
      photo: data.photos[0].value,
      email: data.emails[0].value,
      provider: data.provider,
    };
    const exUser = await db.User.findOne({
      where: {
        email: userInfo.email,
      },
    });
    if (exUser && exUser.socialType == null) {
      // 일반 회원가입으로 이미 가입했으면 socialLogin으로 update
      await db.User.update({
        openId: userInfo.id,
        socialType: userInfo.provider,
        imgSrc: userInfo.photo,
      });

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

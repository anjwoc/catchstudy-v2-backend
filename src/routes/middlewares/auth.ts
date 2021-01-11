import { RequestHandler } from "express";

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req?.session?.cookie) {
    return next();
  }
  return res.status(401).send("로그인이 필요합니다.");
};

export const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("로그인 한 사람은 할 수 없습니다.");
};

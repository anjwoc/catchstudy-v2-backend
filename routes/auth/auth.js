const {isLoggedIn, isNotLoggedIn} = require("../middlewares");
const express = require("express");
const passport = require("passport");
const auth = require("./auth.ctrl");
const router = express.Router();

router.post("/githubLogin", auth.githubLogin);
router.get("/github", passport.authenticate("github"));
router.get("/github/callback", passport.authenticate("github", {failureRedirect: "/login"}), auth.githubCallback);

router.get("/google", passport.authenticate("google", {scope: ["openid", "profile", "email"]}));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  auth.googleCallback,
);

module.exports = router;

const {isLoggedIn, isNotLoggedIn, upload} = require("../middlewares");
const express = require("express");
const tags = require("./tags.ctrl");

const router = express.Router();

// 추후 별도의 라우터로 분리
router.get("/", tags.loadAllHashtags);

module.exports = router;

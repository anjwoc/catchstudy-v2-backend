import express from "express";
import user from "./user";
import auth from "./auth";
import post from "./post";
import posts from "./posts";
import reply from "./reply";
import tags from "./tags";
import comment from "./comment";

const router = express.Router();

router.use("/user", user);
router.use("/auth", auth);
router.use("/post", post);
router.use("/posts", posts);
router.use("/reply", reply);
router.use("/comment", comment);
router.use("/tags", tags);
//router.use('/image', require('./image'));

export default router;

import { isLoggedIn, isNotLoggedIn, upload } from "../middlewares";
import express from "express";
import tags from "./tags.ctrl";

const router = express.Router();

// 추후 별도의 라우터로 분리
router.get("/", tags.loadAllHashtags);

export default router;

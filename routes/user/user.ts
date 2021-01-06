import express from "express";
import user from "./user.ctrl";
import { isLoggedIn, isNotLoggedIn, uploadProfileImage } from "../middlewares";

const router = express.Router();

/* 로그인 */
router.post("/login", isNotLoggedIn, user.logIn);

router.delete("/:id", isLoggedIn, user.deleteAccount);
//접속 유저 정보 반환(로그인 유지할 때 사용)
router.get("/", isLoggedIn, user.loadUser);

//회원가입
router.post("/", isNotLoggedIn, user.signUp);

/* 로그인 */
router.post("/login", isNotLoggedIn, user.logIn);

//로그아웃
router.post("/logout", isLoggedIn, user.logOut);
//비밀번호 변경
router.post("/password", isLoggedIn, user.updatePassword);
//프로필 이미지 변경 or 추가
router.post("/image", uploadProfileImage.fields([{ name: "image" }, { name: "userId" }]), user.uploadProfileImage);
//프로필 정보 업데이트
router.post("/update/:id", isLoggedIn, user.updateProfile);

// //특정 회원 정보 반환
// router.get("/:id", user.loadConnectionUser);

export default router;

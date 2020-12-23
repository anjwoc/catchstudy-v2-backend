const {isLoggedIn, isNotLoggedIn, upload} = require("../middlewares");
const express = require("express");
const posts = require("./posts.ctrl");

const router = express.Router();

/* 세부 검색 기능 */
router.get("/search/:word", posts.searchPosts);

/* 메인 페이지, 인기 페이지 라우터 */
router.get("/", posts.allPosts);
router.get("/trendingPosts", posts.loadTrendingPosts);

/* 프로필 페이지 관련 라우터 */

// router.get('/:id/');

/* 카테고리 관련 라우터 */
router.get("/category", posts.loadCategoryPosts);

/* 해시태그 게시물 라우터 */
// 하나의 게시물을 리턴하기 때문에 post 라우터로 옮겨야 함
router.get("/tags", posts.loadHashtagsPosts);
router.get("/tags/:name", posts.loadHashtagPost);
// 모든 해시태그들의 리스트를 반환한다.

// 프로필 페이지에서 전체 게시글 리스트
router.get("/:id", posts.loadAllPostsList);
// 모집중인 스터디 게시글 리스트
router.get("/:id/recruiting", posts.loadAllRecruitingPostsList);
// 모집이 완료된 스터디 게시글 리스트
router.get("/:id/closed", posts.loadAllClosedPostsList);

module.exports = router;

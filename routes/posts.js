const {isLoggedIn, isNotLoggedIn, upload} = require('./middlewares');
const express = require('express');
const posts = require('../controllers/posts');

const router = express.Router();

/* 검색 기능 */
router.get('/search/:word', posts.searchPosts);

/* 메인 페이지, 인기 페이지 라우터 */
router.get('/', posts.allPosts);
router.get('/trendingPosts', posts.loadTrendingPosts);

router.get('/allTags', posts.loadAllHashtags);

/* 프로필 페이지 관련 라우터 */
// 프로필 페이지에서 전체 게시글 리스트
router.get('/:id/allPosts', posts.loadAllPostsList);
// 모집중인 스터디 게시글 리스트
router.get('/:id/allRecruitingPosts', posts.loadAllRecruitingPostsList);
// 모집이 완료된 스터디 게시글 리스트
router.get('/:id/allClosedPosts', posts.loadAllClosedPostsList);

/* 카테고리 관련 라우터 */
router.get('/categoryPosts', posts.loadCategoryPosts);

/* 해시태그 게시물 라우터 */
router.get('/tags/:name', posts.loadHashtagsPosts);

module.exports = router;

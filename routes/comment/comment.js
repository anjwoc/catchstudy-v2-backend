const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const express = require('express');
const comment = require('./comment.ctrl');

const router = express.Router();

// id와 일치하는 포스트의 전체 댓글 불러오기
router.get('/:id', comment.getComments);

// 댓글 수정
router.post('/update/:id', isLoggedIn, comment.updateComment);

// 댓글 작성
router.post('/:id', isLoggedIn, comment.addComment);

// 댓글 삭제
router.delete('/:id', isLoggedIn, comment.deleteComment);

module.exports = router;

const express = require('express');
const media = require('./media.ctrl');
const {isLoggedIn, isNotLoggedIn, uploadProfileImage} = require('../middlewares');

const router = express.Router();

// router.post('/user/:id', media.addMedia);

module.exports = router;

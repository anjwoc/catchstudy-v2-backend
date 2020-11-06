const {isLoggedIn, isNotLoggedIn, upload} = require('../middlewares');
const express = require('express');
const reply = require('./reply.ctrl');

const router = express.Router();

module.exports = router;

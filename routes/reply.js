const { isLoggedIn, isNotLoggedIn, upload } = require('./middlewares');
const express = require('express');
const reply = require('../controllers/reply');

const router = express.Router();


module.exports = router
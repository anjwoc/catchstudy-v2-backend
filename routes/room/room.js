const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const express = require('express');
const room = require('./room.ctrl');
const router = express.Router();

// router.get('/', room.loadRoom);
router.post('/', room.createRoom);
router.get('/:id', room.loadRoom);
router.delete('/room/:id', room.removeRoom);

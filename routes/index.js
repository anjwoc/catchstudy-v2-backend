const router = require('express').Router();

router.use('/user', require('./user'));
router.use('/auth', require('./auth'));
router.use('/post', require('./post'));
router.use('/posts', require('./posts'));
router.use('/reply', require('./reply'));
router.use('/comment', require('./comment'));
router.use('/media', require('./media'));
//router.use('/image', require('./image'));
router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router;

const db = require('../../models');

exports.addComment = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({where: {id: req.params.id}});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    post.increment('numComments');
    const newComment = await db.Comment.create({
      postId: post.id,
      userId: req.user.id,
      content: req.body.content,
    });
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'imgSrc'],
        },
      ],
    });
    return res.json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await db.Comment.findOne({where: {id: req.params.id}});
    if (!comment) {
      return res.status(404).send('댓글이 존재하지 않습니다.');
    }
    const newComment = await db.Comment.update({
      content: req.body.content,
      where: {id: req.params.id},
    });
    return res.json(newComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({where: {id: req.params.id}});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll({
      where: {
        postId: req.params.id,
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'imgSrc'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({where: {id: req.body.postId}});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    post.decrement('numComments');
    const result = await db.Comment.destroy({
      where: {id: req.params.id},
    });
    return res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const db = require('../../models');

exports.addPost = async (req, res, next) => {
  try {
    const {title, content, location, hashtags, category, type, numPeople, coverImg} = req.body;
    const newPost = await db.Post.create({
      title: title,
      content: content,
      coverImg: coverImg,
      location: location,
      category: category,
      type: type,
      numPeople: numPeople,
      userId: req.user.id,
      hit: 1,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: {name: tag},
          }),
        ),
      );
      await newPost.addHashtags(result.map(r => r[0]));
    }

    if (req.body.image) {
      //이미지가 있다면
      if (Array.isArray(req.body.image)) {
        //이미자가 여러개이면
        await Promise.all(
          req.body.image.map(image => {
            return db.Image.create({src: image, postId: newPost.id});
          }),
        );
      } else {
        //하나일 때
        await db.Image.create({src: req.body.imgae, postId: newPost.id});
      }
    }
    const fullPost = await db.Post.findOne({
      where: {id: newPost.id},
      include: [
        {
          model: db.User,
          attributes: ['email', 'name'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await db.Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json('삭제 성공');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const {title, content, location, hashtags, tagHistory, category, image} = req.body;
    await db.Post.update(
      {
        title: title,
        content: content,
        location: location,
        category: category,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    const updatedPost = await db.Post.findOne({where: {id: req.params.id}});
    // 만약 기존의 해시태그에서 줄어들었다면 filter로 삭제된 태그를 찾아서 디비에서 제거
    const deleteTags = tagHistory.filter(v => !hashtags.includes(v));
    if (deleteTags) {
      const result = await updatedPost.removeHashtags(
        deleteTags.map(r => {
          db.Hashtag.destroy({
            where: {name: r},
          });
        }),
      );
    }
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            where: {name: tag},
          }),
        ),
      );
      await updatedPost.addHashtags(result.map(r => r[0]));
    }

    if (image) {
      //이미지가 있다면
      if (Array.isArray(image)) {
        //이미자가 여러개이면
        await Promise.all(
          image.map(image => {
            return db.Image.create({src: image, postId: updatedPost.id});
          }),
        );
      } else {
        //하나일 때
        await db.Image.create({src: imgae, postId: updatedPost.id});
      }
    }
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    let status = req.body.status;
    if (status === 'open') {
      status = 'closed';
    } else {
      res.status(403).send('이미 모집완료된 스터디입니다.');
    }
    await db.Post.update(
      {
        status: status,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );
    res.json(status);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//이미지 업로드
exports.uploadImage = (req, res, next) => {
  // v.filename이 v.location으로 변경
  res.json(req.files.map(v => v.location));
};

exports.uploadThumbnail = async (req, res, next) => {
  try {
    // const post = await db.Post.findOne({where: {id: req.body.postId}});
    // if (!post) {
    //   res.status(404).send('존재하지 않는 게시글입니다.');
    // }
    // if (req.file.image) {
    //   const path = req.file.image.location;
    //   await db.Post.update(
    //     {
    //       coverImg: path,
    //     },
    //     {
    //       where: {id: req.body.postId},
    //     },
    //   );
    //   return res.status(304).send('No Change');
    // }

    return res.json(req.file.location);
  } catch (err) {
    console.error(err);
  }
};

exports.loadUpdatePost = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {id: req.params.id},
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc', 'about'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: db.Hashtag,
          as: 'hashtags',
          attributes: ['name'],
        },
      ],
    });
    res.json(post);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.loadPost = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {id: req.params.id},
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc', 'about'],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: db.Hashtag,
          as: 'hashtags',
          attributes: ['name'],
        },
      ],
    });
    post.increment('hit');

    res.json(post);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.addLike = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({where: {id: req.params.id}});

    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    post.increment('like');
    await post.addLiker(req.user.id);
    res.json({userId: req.user.id});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.removeLike = async (req, res, next) => {
  try {
    const post = await db.Post.findOne({where: {id: req.params.id}});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다');
    }
    post.decrement('like');
    await post.removeLiker(req.user.id);
    res.json({userId: req.user.id});
  } catch (err) {
    console.error(err);
    next(err);
  }
};

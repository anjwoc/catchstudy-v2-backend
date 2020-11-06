const db = require('../../models');
const Sequelize = require('sequelize');
const queryString = require('querystring');
const Op = Sequelize.Op;
const QueryTypes = Sequelize.QueryTypes;

exports.allPosts = async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      //lastId가 있을 경우
      where = {
        id: {
          //less than
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      attributes: [
        'id',
        'title',
        'category',
        'content',
        'hit',
        'status',
        'createdAt',
        'userId',
        'like',
        'coverImg',
        'location',
        'numPeople',
        'numComments',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc'],
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
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.loadTrendingPosts = async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          //less than
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const posts = await db.Post.findAll({
      where,
      attributes: [
        'id',
        'title',
        'content',
        'category',
        'hit',
        'status',
        'createdAt',
        'userId',
        'like',
        'numComments',
        'coverImg',
        'numPeople',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc'],
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
      order: [['like', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// 모든 해시태그들의 리스트를 반환한다.
exports.loadAllHashtags = async (req, res, next) => {
  try {
    // const tags = await db.Hashtag.findAll({
    //   attributes: ['name']
    // });
    const tags = await db.sequelize.query('SELECT name FROM hashtags', {type: QueryTypes.SELECT});
    return res.json(tags);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.loadAllPostsList = async (req, res, next) => {
  try {
    let where = {userId: req.params.id};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
        userId: req.params.id,
      };
    }
    const posts = await db.Post.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.loadAllRecruitingPostsList = async (req, res, next) => {
  try {
    let where = {
      userId: req.params.id,
      status: 'open',
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
        userId: req.params.id,
        status: 'open',
      };
    }

    const posts = await db.Post.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.loadAllClosedPostsList = async (req, res, next) => {
  try {
    let where = {
      userId: req.params.id,
      status: 'closed',
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
        userId: req.params.id,
        status: 'closed',
      };
    }

    const posts = await db.Post.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.loadHashtagsPosts = async (req, res, next) => {
  try {
    const name = req.params.name;
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const tagPosts = await db.Post.findAll(
      {
        where,
        include: [
          {
            model: db.User,
            attributes: ['id', 'email', 'name', 'imgSrc'],
          },
          {
            model: db.Image,
          },
          {
            model: db.Hashtag,
            as: 'hashtags',
            where: {name: name},
            attributes: ['name'],
          },
        ],
      },
      {
        order: [['createdAt', 'DESC']],
        limit: parseInt(req.query.limit, 10) || 10,
      },
    );
    res.json(tagPosts);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.loadCategoryPosts = async (req, res, next) => {
  try {
    const item = req.query.item;
    const lastId = req.query.lastId;

    if (!item) {
      res.status(403).send('카테고리 분류가 없습니다.');
    }

    let where = {category: item};
    if (parseInt(lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(lastId, 10),
        },
        category: item,
      };
    }
    const categoryPosts = await db.Post.findAll({
      where,
      attributes: [
        'id',
        'title',
        'category',
        'hit',
        'status',
        'createdAt',
        'userId',
        'like',
        'numComments',
        'numPeople',
      ],
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc'],
        },
        {
          model: db.Image,
        },
        {
          model: db.Hashtag,
          as: 'hashtags',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(categoryPosts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.searchPosts = async (req, res, next) => {
  try {
    const word = req.params.word;
    const lastId = req.query.lastId;
    let where = {
      title: {
        [Op.like]: `%${word}%`,
      },
    };
    if (parseInt(lastId, 10)) {
      where.push({
        id: {
          [Op.lt]: parseInt(lastId, 10),
        },
      });
    }
    const searchPosts = await db.Post.findAll({
      where,
      include: [
        {
          model: db.User,
          attributes: ['id', 'email', 'name', 'imgSrc'],
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
    return res.json(searchPosts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

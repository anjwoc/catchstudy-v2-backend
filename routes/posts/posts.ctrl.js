const db = require("../../models");
const Sequelize = require("sequelize");
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
        "id",
        "title",
        "category",
        "content",
        "hit",
        "status",
        "createdAt",
        "userId",
        "like",
        "coverImg",
        "location",
        "numPeople",
        "numComments",
      ],
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "name", "imgSrc"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Hashtag,
          // as: "hashtags",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
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
        "id",
        "title",
        "content",
        "category",
        "hit",
        "status",
        "createdAt",
        "userId",
        "like",
        "numComments",
        "coverImg",
        "numPeople",
      ],
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "name", "imgSrc"],
        },
        {
          model: db.Image,
        },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Hashtag,
          as: "hashtags",
          attributes: ["name"],
        },
      ],
      order: [["like", "DESC"]],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
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
      order: [["createdAt", "DESC"]],
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
      status: "open",
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
        userId: req.params.id,
        status: "open",
      };
    }

    const posts = await db.Post.findAll({
      where,
      order: [["createdAt", "DESC"]],
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
      status: "closed",
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
        },
        userId: req.params.id,
        status: "closed",
      };
    }

    const posts = await db.Post.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.loadHashtagPost = async (req, res, next) => {
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
            attributes: ["id", "email", "name", "imgSrc"],
          },
          {
            model: db.Image,
          },
          {
            model: db.Hashtag,
            as: "hashtags",
            where: {name: name},
            attributes: ["name"],
          },
        ],
      },
      {
        order: [["createdAt", "DESC"]],
        limit: parseInt(req.query.limit, 10) || 10,
      },
    );
    res.json(tagPosts);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

exports.loadHashtagsPosts = async (req, res, next) => {
  try {
    const hashtags = req.query.tags;
    const tags = hashtags.split(",");
    const result = await Promise.all(
      tags.map(tag => {
        return db.Hashtag.findAll({
          where: {name: tag},
          include: [
            {
              model: db.Post,
              attributes: ["id", "title"],
            },
          ],
        });
      }),
    );

    let arr = [];
    result.forEach(item => {
      const data = item[0].posts.map(post => {
        return {id: post.id, title: post.title};
      });
      arr = [].concat(arr, data);
    });

    const posts = [];
    const postsMap = new Map();
    for (const item of arr) {
      if (!postsMap.has(item.id)) {
        postsMap.set(item.id, true);
        posts.push({
          id: item.id,
          title: item.title,
        });
      }
    }

    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.loadCategoryPosts = async (req, res, next) => {
  try {
    const category = req.query.category;
    const lastId = req.query.lastId;
    if (!category) {
      res.status(403).send("카테고리 분류가 없습니다.");
    }

    let where = {category: category};
    if (parseInt(lastId, 10)) {
      where = {
        id: {
          [db.Sequelize.Op.lt]: parseInt(lastId, 10),
        },
        category: category,
      };
    }
    const categoryPosts = await db.Post.findAll({
      where,
      attributes: [
        "id",
        "title",
        "coverImg",
        "category",
        "content",
        "location",
        "hit",
        "status",
        "userId",
        "like",
        "numComments",
        "numPeople",
        "createdAt",
      ],
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "name", "imgSrc"],
        },
        {
          model: db.Hashtag,
          as: "hashtags",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(categoryPosts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/* 
  일반 단어 검색, 해시태그 조건 검색, 지역 조건 검색
  1. 검색어를 파라미터 형식으로 전달받는 부분을 쿼리스트링으로 변경
  2. 검색 조건 별 옵션 수정
    - 검색어만 있는 경우
    - 검색어와 지역만 있는 경우
    - 검색어, 지역, 해시태그 모두 있는 경우
*/

exports.searchPosts = async (req, res, next) => {
  try {
    const word = req.query.word;
    const lastId = req.query.lastId;
    const hashtags = req.query.tags;
    const location = req.query.location;
    const tags = hashtags && hashtags.split(",");
    let where = {
      [Op.and]: [],
    };
    let tagCondition = {};

    if (tags) {
      tagCondition = {
        name: {
          [Op.or]: tags,
        },
      };
    }

    if (word) {
      where[Op.and].push({
        title: {
          [Op.like]: `%${word}%`,
        },
      });
    }

    if (location) {
      where[Op.and].push({
        location: location,
      });
    }

    if (parseInt(lastId, 10)) {
      where = Object.assign(where, {
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
          attributes: ["id", "email", "name", "imgSrc"],
        },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: db.Hashtag,
          as: "hashtags",
          where: tagCondition || {},
          attributes: [],
        },
      ],
    });

    return res.json(searchPosts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

import { db } from "../../models";
import { Sequelize, Op, QueryTypes } from "sequelize";

const allPosts = async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      //lastId가 있을 경우
      where = {
        id: {
          //less than
          [Op.lt]: parseInt(req.query.lastId, 10),
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
          as: "hashtags",
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

const loadTrendingPosts = async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          //less than
          [Op.lt]: parseInt(req.query.lastId, 10),
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

const loadAllPostsList = async (req, res, next) => {
  try {
    let where: object = { userId: req.params.id };
    const lastId: number = parseInt(req.query.lastId, 10);
    const limit: number = parseInt(req.query.limit, 10);
    if (lastId) {
      where = {
        id: {
          [Op.lt]: lastId,
        },
        userId: req.params.id,
      };
    }
    const posts = await db.Post.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limit || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const loadAllRecruitingPostsList = async (req, res, next) => {
  try {
    let where: object = {
      userId: req.params.id,
      status: "open",
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [Op.lt]: parseInt(req.query.lastId, 10),
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

const loadAllClosedPostsList = async (req, res, next) => {
  try {
    let where: object = {
      userId: req.params.id,
      status: "closed",
    };
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [Op.lt]: parseInt(req.query.lastId, 10),
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
const loadHashtagPost = async (req, res, next) => {
  try {
    const name = req.params.name;
    let where = {};
    if (parseInt(req.query.lastId, 10)) {
      where = {
        id: {
          [Op.lt]: parseInt(req.query.lastId, 10),
        },
      };
    }
    const tagPosts = await db.Post.findAll({
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
          where: { name: name },
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(tagPosts);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const loadHashtagsPosts = async (req, res, next) => {
  try {
    const hashtags = req.query.tags;
    const tags = hashtags.split(",");
    const where = {
      name: {
        [Op.or]: tags,
      },
    };

    const posts = await db.Post.findAll({
      attributes: ["id", "title"],
      include: [
        {
          model: db.Hashtag,
          as: "hashtags",
          where,
          attributes: [],
        },
      ],
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const loadCategoryPosts = async (req, res, next) => {
  try {
    const category: string = req.query.category;
    const lastId: string = req.query.lastId;
    if (!category) {
      res.status(403).send("카테고리 분류가 없습니다.");
    }

    let where: object = { category: category };
    if (parseInt(lastId, 10)) {
      where = {
        id: {
          [Op.lt]: parseInt(lastId, 10),
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

const searchPosts = async (req, res, next) => {
  try {
    const word: string = req.query.word;
    const lastId: string = req.query.lastId;
    const hashtags: string = req.query.tags;
    const location: string = req.query.location;
    const tags: string[] = hashtags && hashtags.split(",");
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

export default {
  searchPosts,
  loadCategoryPosts,
  loadHashtagsPosts,
  loadHashtagPost,
  loadAllClosedPostsList,
  loadAllRecruitingPostsList,
  loadAllPostsList,
  loadTrendingPosts,
  allPosts,
};

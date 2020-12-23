const db = require("../../models");
const Sequelize = require("sequelize");
const QueryTypes = Sequelize.QueryTypes;

// 모든 해시태그들의 리스트를 반환한다.
exports.loadAllHashtags = async (req, res, next) => {
  try {
    const tags = await db.sequelize.query("SELECT name FROM hashtag limit 10", {type: QueryTypes.SELECT});
    return res.json(tags);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

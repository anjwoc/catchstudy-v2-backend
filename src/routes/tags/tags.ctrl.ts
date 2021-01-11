import Sequelize from "sequelize";
import { db, sequelize } from "../../models";
const QueryTypes = Sequelize.QueryTypes;

// 모든 해시태그들의 리스트를 반환한다.
const loadAllHashtags = async (req, res, next) => {
  try {
    const query = "SELECT name FROM hashtag limit 10";
    const tags = await sequelize.query(query, { type: QueryTypes.SELECT });
    return res.json(tags);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export default {
  loadAllHashtags,
};

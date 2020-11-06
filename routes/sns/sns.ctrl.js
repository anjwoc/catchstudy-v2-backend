const db = require('../../models');

exports.addSns = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {github, gmail, facebook} = req.body;

    await db.Sns.findOrCreate({
      where: {userId: id},
      defaults: {
        github: github,
        gmail: gmail,
        facebook: facebook || 'https://www.facebook.com/',
      },
    }).spread((result, created) => {
      //created는 만들어진 경우의 객체다.
      if (created) {
        return res.json(created);
      }
    });

    await db.Sns.update(
      {
        github: github,
        gmail: gmail,
        facebook: facebook,
      },
      {
        where: {userId: id},
      },
    );

    await db.Sns.findOne({where: {userId: id}});
    return res.status(200);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

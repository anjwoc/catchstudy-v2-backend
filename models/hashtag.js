module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'hashtag',
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8_unicode_ci',
      freezeTableName: true,
    },
  );
  Hashtag.associate = db => {
    db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'});
  };
  return Hashtag;
};

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      content: {
        type: DataTypes.TEXT, //긴글
        allowNull: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci', //한글 저장
      freezeTableName: true,
    },
  );

  Comment.associate = db => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Comment.hasMany(db.Reply);
  };
  return Comment;
};

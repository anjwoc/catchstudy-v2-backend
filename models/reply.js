module.exports = (sequelize, DataTypes) => {
  //대댓글
  const Reply = sequelize.define(
    'reply',
    {
      title: {
        type: DataTypes.STRING(50), //40자 이내
        allowNull: false, // 필수
      },
      content: {
        type: DataTypes.TEXT, //40자 이내
        allowNull: false, // 필수
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci', //한글 저장
    },
  );

  Reply.associate = db => {
    db.Reply.belongsTo(db.Comment);
    db.Reply.belongsTo(db.User);
  };
  return Reply;
};

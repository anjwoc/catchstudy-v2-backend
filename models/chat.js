module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "chat",
    {
      user: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      chat: {
        type: DataTypes.STRING(100),
      },
      image: {
        type: DataTypes.STRING(100),
      },
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      freezeTableName: true,
    },
  );

  Chat.associate = db => {
    db.Chat.belongsTo(db.Room);
  };

  return Chat;
};

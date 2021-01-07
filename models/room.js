module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "room",
    {
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [3, 20],
        },
      },
      maxNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      owner: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
      },
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci",
      freezeTableName: true,
    },
  );

  Room.associate = db => {
    db.Room.belongsTo(db.User);
    db.Room.hasMany(db.Chat);
    db.Room.belongsToMany(db.Chat, { through: "ChatRoom" });
    db.Room.belongsToMany(db.User, { through: "UserRooms" });
  };

  return Room;
};

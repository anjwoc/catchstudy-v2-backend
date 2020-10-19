module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'image',
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci', // 한글 저장돼요
    },
  );
  Image.associate = db => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};

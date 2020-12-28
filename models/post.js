module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING(50), //40자 이내
        allowNull: false, // 필수
      },
      content: {
        type: DataTypes.TEXT, //40자 이내
        allowNull: false, // 필수
      },
      coverImg: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["온라인", "오프라인"],
      },
      category: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["어학", "취업", "고시", "자격증", "프로그래밍", "기타"],
      },
      location: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      numPeople: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      numComments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      questions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      hit: {
        // 조회수 속성
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["closed", "open"],
        defaultValue: "open",
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_unicode_ci", //한글 저장
      freezeTableName: true,
    },
  );

  Post.associate = db => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.User, {through: "Like", as: "Likers"});
    db.Post.belongsToMany(db.Hashtag, {through: "PostHashtag"});
  };
  return Post;
};

module.exports = (sequelize, DataTypes) => {
  const Sns = sequelize.define('sns', {
    gmail: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true, 
    },
    github: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    facebook: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true, 
    },
  },{
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci' //한글 저장
  })
  
  Sns.associate = (db) => {
    db.Sns.belongsTo(db.User);
  };
  return Sns;
};
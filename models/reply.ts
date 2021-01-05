import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Reply extends Model {
  public readonly id!: number;
  public title!: string;
  public content!: string;
  public category!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reply.init(
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
    sequelize,
    modelName: "Reply",
    tableName: "reply",
    charset: "utf8",
    collate: "utf8_general_ci", //한글 저장
    freezeTableName: true,
  },
);

export const associate = (db: dbType) => {
  db.Reply.belongsTo(db.Comment);
  db.Reply.belongsTo(db.User);
};

export default Reply;

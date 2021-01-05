import { Model, DataTypes } from "sequelize";
import { dbType } from "./index";
import { sequelize } from "./sequelize";

class Comment extends Model {
  public readonly id!: number;
  public content!: string;
  public isPrivate!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
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
    sequelize,
    modelName: "Comment",
    tableName: "comment",
    charset: "utf8",
    collate: "utf8_general_ci", //한글 저장
    freezeTableName: true,
    // timestamps: false,
  },
);
export const associate = (db: dbType) => {
  db.Comment.belongsTo(db.User);
  db.Comment.belongsTo(db.Post);
  db.Comment.hasMany(db.Reply);
};

export default Comment;

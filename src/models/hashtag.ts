import { Model, DataTypes } from "sequelize";
import { dbType } from "./index";
import { sequelize } from "./sequelize";

interface IHashtag {
  readonly id: number;
  name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

class Hashtag extends Model {
  public readonly id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Hashtag.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "hashtag",
    tableName: "hashtag",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    freezeTableName: true,
    // timestamps: false,
  },
);

export const associate = (db: dbType) => {
  db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag", as: "hashtags" });
};
export { IHashtag };
export default Hashtag;

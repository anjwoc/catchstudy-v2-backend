import { Model, DataTypes } from "sequelize";
import { dbType } from "./index";
import { sequelize } from "./sequelize";

class Image extends Model {
  public readonly id!: Number;
  public src!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Image.init(
  {
    src: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "image",
    tableName: "image",
    charset: "utf8",
    collate: "utf8_general_ci",
    freezeTableName: true,
    // timestamps: true,
  },
);

export const associate = (db: dbType) => {
  db.Image.belongsTo(db.Post);
};

export default Image;

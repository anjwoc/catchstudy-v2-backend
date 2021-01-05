import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Sns extends Model {
  public readonly id!: number;
  public gmail: string | undefined;
  public github: string | undefined;
  public facebook: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sns.init(
  {
    gmail: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    kakao: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Media",
    tableName: "media",
    freezeTableName: true,
    // timestamps: false,
    charset: "utf8",
    collate: "utf8_general_ci", //한글 저장
  },
);

// export const associate = (db: dbType) => {
//   db.Sns.belongsTo(db.User);
// };

export default Sns;

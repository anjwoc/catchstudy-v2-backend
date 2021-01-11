import { Model, DataTypes } from "sequelize";
import { db, dbType } from "./index";
import { sequelize } from "./sequelize";
import {
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
} from "sequelize";
import Hashtag from "./hashtag";
import User from "./user";
import Image from "./image";

enum CategoryTypes {
  "어학",
  "고시/공무원",
  "취미/교양",
  "프로그래밍",
  "자율",
  "기타",
}
enum StudyTypes {
  "온라인",
  "오프라인",
}

enum PostStatusTypes {
  "모집중",
  "모집마감",
}

interface IPost {
  readonly id: number;
  title: string;
  content: string;
  category: CategoryTypes;
  type: StudyTypes;
  coverImg: string;
  location: string;
  numPeople: string;
  numComments: number;
  minPeople: number;
  maxPeople: number;
  questions: object;
  likes: number | undefined;
  hit: number | undefined;
  status: PostStatusTypes;
  user: User;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  addHashtag: BelongsToManyAddAssociationMixin<Hashtag, number>;
  addHashtags: BelongsToManyAddAssociationMixin<Hashtag, number>;
  removeHashtag: BelongsToManyRemoveAssociationMixin<Hashtag, number>;
  addLiker: BelongsToManyAddAssociationMixin<User, number>;
  removeLiker: BelongsToManyRemoveAssociationMixin<User, number>;
  addImage: HasManyAddAssociationMixin<Image, number>;
  addImages: HasManyAddAssociationMixin<Image, number>;
}

class Post extends Model {
  public readonly id!: number;
  public title!: string;
  public content!: string;
  public category!: CategoryTypes;
  public type!: StudyTypes;
  public coverImg!: string;
  public location!: string;
  public numPeople!: string;
  public numComments!: number;
  public minPeople!: number;
  public maxPeople!: number;
  public questions!: object;
  public likes: number | undefined;
  public hit: number | undefined;
  public status!: PostStatusTypes;
  public readonly userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public addHashtag!: HasManyAddAssociationMixin<Hashtag, string | object>;
  public removeHashtag!: HasManyRemoveAssociationMixin<Hashtag, string | object>;
  public addLiker!: HasManyAddAssociationMixin<User, object | number>;
  public removeLiker!: HasManyRemoveAssociationMixin<User, object | number>;
}

Post.init(
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
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["어학", "취업", "고시", "자격증", "프로그래밍", "기타"],
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
    location: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    minPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxPeople: {
      type: DataTypes.INTEGER,
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
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    hit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["모집중", "모집마감"],
      defaultValue: "모집중",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "post",
    tableName: "post",
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci", //한글 저장
    freezeTableName: true,
  },
);

export const associate = (db: dbType) => {
  db.Post.belongsTo(db.User);
  db.Post.hasMany(db.Comment);
  db.Post.hasMany(db.Image);
  db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
  db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag", as: "hashtags" });
};

export { IPost };

export default Post;

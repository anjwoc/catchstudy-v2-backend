import {
  Model,
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from "sequelize";
import { dbType } from "./index";
import { sequelize } from "./sequelize";
import { ProfileData } from "../interfaces/passport.interface";
import Post from "./post";

enum SocialTypes {
  "github",
  "google",
  "kakao",
}

export interface IUser extends ProfileData {
  readonly id: number;
  email: string;
  password: string;
  openId: string | undefined;
  socialType: SocialTypes | undefined;
  userId: string;
  name: string;
  about: string;
  job: string | undefined;
  location: string | undefined;
  imgSrc: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

class User extends Model {
  public readonly id!: number;
  public email!: string;
  public password!: string;
  public openId: string | undefined;
  public socialType: SocialTypes | undefined;
  public userId!: string;
  public name!: string;
  public about!: string;
  public job: string | undefined;
  public location!: string | undefined;
  public imgSrc!: string;
  public gmail!: string;
  public readonly Posts?: Post[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addFollowing!: BelongsToManyAddAssociationMixin<User, number>;
  public getFollowings!: BelongsToManyGetAssociationsMixin<User>;
  public removeFollowing!: BelongsToManyRemoveAssociationMixin<User, number>;
  public getFollowers!: BelongsToManyGetAssociationsMixin<User>;
  public removeFollower!: BelongsToManyRemoveAssociationMixin<User, number>;
  public getPosts!: HasManyGetAssociationsMixin<Post>;
}

User.init(
  {
    email: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: false, // 필수
      unique: true, // 중복 금지
    },
    openId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    socialType: {
      type: DataTypes.ENUM,
      values: ["github", "google", "kakao"],
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    job: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gmail: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    kakao: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    github: {
      type: DataTypes.STRING(40), //40자 이내
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    imgSrc: {
      //프로필 이미지
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: process.env.DEFAULT_PROFILE_IMG,
    },
  },
  {
    // sequelize.ts에서 생성한 Sequelize객체를 넣어줘야 실제 디비랑 연결이 된다.
    sequelize,
    modelName: "user",
    tableName: "user",
    charset: "utf8",
    collate: "utf8_general_ci",
    freezeTableName: true,
  },
);

export const associate = (db: dbType) => {
  // db.User.hasOne(db.Sns);
  db.User.hasMany(db.Post);
  db.User.hasMany(db.Comment);
  db.User.hasMany(db.Reply);
  db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
  db.User.belongsToMany(db.User, { through: "Follow", as: "Followers", foreignKey: "followingId" });
  db.User.belongsToMany(db.User, { through: "Follow", as: "Followings", foreignKey: "followerId" });
};

export default User;

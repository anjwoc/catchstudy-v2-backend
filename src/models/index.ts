import User, { associate as associateUser, IUser } from "./user";
import Post, { associate as associatePost, IPost } from "./post";
import Comment, { associate as associateComment } from "./comment";
import Hashtag, { associate as associateHashtag, IHashtag } from "./hashtag";
import Image, { associate as associateImage } from "./image";
import Reply, { associate as associateReply } from "./reply";

export * from "./sequelize";

const db = {
  User,
  Post,
  Comment,
  Hashtag,
  Image,
  Reply,
};

associateUser(db);
associateComment(db);
associateHashtag(db);
associateImage(db);
associatePost(db);
associateReply(db);

type dbType = typeof db;

export { dbType, db, IPost, IUser, IHashtag };

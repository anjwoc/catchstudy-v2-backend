import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import path from "path";

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

export const uploadProfileImage = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "catch-study-bucket",
    acl: "public-read", // 클라이언트에서 자유롭게 사용하기 위함
    key(req, file, cb) {
      cb(null, `original/profile/${Date.now()}-${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 22 * 1024 * 1024 },
});

export const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "catch-study-bucket",
    acl: "public-read", // 클라이언트에서 자유롭게 사용하기 위함
    key(req, file, cb) {
      cb(null, `original/${Date.now()}-${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 22 * 1024 * 1024 },
});

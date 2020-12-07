const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config();

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

exports.uploadProfileImage = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'catch-study-bucket',
    acl: 'public-read', // 클라이언트에서 자유롭게 사용하기 위함
    key(req, file, cb) {
      cb(null, `original/profile/${Date.now()}-${path.basename(file.originalname)}`);
    },
  }),
  limit: {fileSize: 22 * 1024 * 1024},
});

exports.upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'catch-study-bucket',
    acl: 'public-read', // 클라이언트에서 자유롭게 사용하기 위함
    key(req, file, cb) {
      cb(null, `original/${Date.now()}-${path.basename(file.originalname)}`);
    },
  }),
  limit: {fileSize: 22 * 1024 * 1024},
});

// exports.uploadProfileImage = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done){
//       done(null, 'Uploads/profileImage');
//     },
//     filename(req, file, done){
//       const ext = path.extname(file.originalname);
//       done(null, 'profileImage-'+ req.body.userId + ext);
//     },
//   }),
//   limit: { fileSize: 22 * 1024 * 1024 },
// });

// exports.upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done){
//       done(null, 'uploads');
//     },
//     filename(req, file, done){
//       const ext = path.extname(file.originalname);
//       const basename = path.basename(file.originalname, ext); // test.png, basename = test, ext = .png
//       done(null, basename + Date.now() + ext);
//     },
//   }),
//   limit: { fileSize: 22 * 1024 * 1024 },
// });

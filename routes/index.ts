import express from "express";
import auth from "./auth";

const router = express.Router();

router.use("/user", require("./user"));
router.use("/auth", auth);
router.use("/post", require("./post"));
router.use("/posts", require("./posts"));
router.use("/reply", require("./reply"));
router.use("/comment", require("./comment"));
router.use("/tags", require("./tags"));
//router.use('/image', require('./image'));
router.get("/", (req, res) => {
  res.send("api root");
});

export default router;

// module.exports = router;

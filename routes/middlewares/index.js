const authMiddleware = require("./auth");
const utilMiddleware = require("./util");

module.exports = { ...authMiddleware, ...utilMiddleware };

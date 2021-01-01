const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const dotenv = require("dotenv");
const db = require("./models");
const routes = require("./routes");
// const webSocket = require('./socket');
const passportConfig = require("./passport");
const prod = process.env.NODE_ENV === "production";
passportConfig();
dotenv.config();

const app = express();
// const server = require("http").createServer(app);
// const io = require('socket.io')(server);

db.sequelize.sync({force: false});

const port = process.env.PORT || 4000;
app.set("port", port);
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    // domain: prod && '.delog.net',
  },
});

if (prod) {
  app.use(helmet());
  app.use(hpp());
  app.use(morgan("combined"));
  app.use(
    cors({
      // origin: /delog\.net$/,
      // origin: ["http://catchstudy.online", "https://catchstudy.online"],
      origin: /catchstudy\.online$/,
      credentials: true,
    }),
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://anjwoc.iptime.org:3000"],
      credentials: true,
    }),
  );
}

app.use("/", express.static("uploads"));
app.use("/profile/", express.static("uploads/profileImage"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);

app.listen(app.get("port"), () => {
  console.log(`Server is Listening on port ${app.get("port")}`);
});

// webSocket(io, app);
// module.exports = app;

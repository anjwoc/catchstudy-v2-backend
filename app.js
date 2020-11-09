const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const prod = process.env.NODE_ENV === 'production';
const hpp = require('hpp');
const helmet = require('helmet');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const ColorHash = require('color-hash');
const db = require('./models');
const routes = require('./routes');
const webSocket = require('./socket');
const passportConfig = require('./passport');
passportConfig();
dotenv.config();

const app = express();

db.sequelize.sync({force: false});

const port = process.env.PORT || 4000;
app.set('port', port);
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
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: /delog\.net$/,
      credentials: true,
    }),
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
}

app.use('/', express.static('uploads'));
app.use('/profile/', express.static('uploads/profileImage'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(flash());
app.use((req, res, next) => {
  // 테스트 후 미들웨어 별도 분리
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

const server = app.listen(app.get('port'), () => {
  console.log(`Server is Listening on port ${app.get('port')}`);
});

webSocket(server, app, sessionMiddleware);

// module.exports = app;

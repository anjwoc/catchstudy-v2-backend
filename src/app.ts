import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import hpp from 'hpp';
import helmet from 'helmet';
import routes from './routes';
import passportConfig from './passport';
import { sequelize } from './models';

dotenv.config();
passportConfig();
const app = express();
const prod: boolean = process.env.NODE_ENV === 'production';
console.log('production: ' + prod);
console.log(process.env.NODE_ENV);
app.set('port', prod ? process.env.PORT : 4000);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Successfully DB Connection');
  })
  .catch((err: Error) => {
    console.error(err);
  });

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: /catchstudy\.online$/,
      credentials: true,
    }),
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
}

app.enable('trust proxy');
app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: true, // https -> ture
      domain: prod ? '.catchstudy.online' : undefined,
      path: '/'
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/api', routes);

app.listen(app.get('port'), () => {
  console.log(`Server is Listening on port ${app.get('port')}`);
});

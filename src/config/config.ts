import dotenv from "dotenv";
dotenv.config();
type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string;
};

interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    charset: "utf8",
    collate: "utf8_general_ci",
  },
  test: {
    username: "root",
    password: null!,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    charset: "utf8",
    collate: "utf8_general_ci",
  },
};
export default config;

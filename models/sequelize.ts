import { Sequelize } from "sequelize";
import config from "../config/config";

// prettier-ignore
const env = process.env.NODE_ENV as ('production' | 'test' | 'development') || 'development'!;
const { database, username, password, dialect, host } = config[env];
const sequelize = new Sequelize(database, username, password, {
  dialect: "mysql",
  host: host,
});

export { sequelize };
export default sequelize;

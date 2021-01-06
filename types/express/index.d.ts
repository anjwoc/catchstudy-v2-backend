import { IUser } from "../../models/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
  interface Response {
    user?: IUser;
  }
}

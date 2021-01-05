import { IUser } from "../interfaces/user.interface";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
  interface Response {
    user?: IUser;
  }
}

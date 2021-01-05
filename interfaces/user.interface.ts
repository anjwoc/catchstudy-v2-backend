import User from "../models/user";
import { ProfileData } from "./passport.interface";
export interface IUser extends User, ProfileData {}

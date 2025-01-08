import { IUser } from "../../data-access";
import { UserCreateResponse, UserLoginResponse } from "./auth.service";

export interface AuthStrategy {
  register(data: any): Promise<IUser>;
  authenticate(data: any): Promise<UserLoginResponse>;
  getEmailValidationLink?(data: UserCreateResponse): Promise<string>;
}

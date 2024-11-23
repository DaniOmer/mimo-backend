import { UserCreateResponse, UserLoginResponse } from "./auth.service";

export interface AuthStrategy {
  register(data: any): Promise<UserCreateResponse>;
  authenticate(data: any): Promise<UserLoginResponse>;
}

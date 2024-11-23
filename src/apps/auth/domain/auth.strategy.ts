import { UserResponse } from "./auth.service";

export interface AuthStrategy {
  register(data: any): Promise<UserResponse>;
  login(data: any): Promise<UserResponse>;
}

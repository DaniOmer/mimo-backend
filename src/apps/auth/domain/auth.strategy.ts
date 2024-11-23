import { UserResponse } from "./auth.service";

export interface AuthStrategy {
  register(data: any): Promise<UserResponse>;
  authenticate(data: any): Promise<UserResponse>;
}

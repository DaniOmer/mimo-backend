import { IUser } from "../data-access/user.interface";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { AuthStrategy } from "./auth.strategy";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserLogin = Pick<IUser, "email" | "password" | "updatedAt">;
export type UserCreateResponse = Omit<IUser, "id" | "password" | "updatedAt">;
export type UserLoginResponse = UserCreateResponse & {
  token: string;
};

export class AuthService {
  private authStrategy: AuthStrategy;

  constructor(strategy: Strategy) {
    this.authStrategy = AuthStrategyFactory.create(strategy);
  }

  async register(userData: UserCreate) {
    return this.authStrategy.register(userData);
  }

  async login(userData: UserLogin): Promise<UserLoginResponse> {
    return this.authStrategy.authenticate(userData);
  }
}

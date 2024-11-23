import { IUser } from "../data-access/user.interface";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { AuthStrategy } from "./auth.strategy";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserResponse = Omit<IUser, "password">;

export class AuthService {
  private authStrategy: AuthStrategy;

  constructor(strategy: Strategy) {
    this.authStrategy = AuthStrategyFactory.create(strategy);
  }

  async register(userData: UserCreate) {
    return this.authStrategy.register(userData);
  }
}

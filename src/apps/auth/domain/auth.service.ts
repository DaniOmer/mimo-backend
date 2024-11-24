import { IUser } from "../data-access/user.interface";
import { UserRepository } from "../data-access/user.repository";
import { AuthStrategyFactory, Strategy } from "./auth.factory";
import { AuthStrategy } from "./auth.strategy";

export type UserCreate = Omit<IUser, "_id" | "createdAt" | "updatedAt">;
export type UserLogin = Pick<IUser, "email" | "password" | "updatedAt">;
export type UserCreateResponse = Omit<IUser, "id" | "password" | "updatedAt">;
export type UserResponse = Omit<IUser, "password">;
export type UserLoginResponse = UserCreateResponse & {
  token: string;
};

export class AuthService {
  private authStrategy: AuthStrategy;
  private userRepository: UserRepository;


  constructor(strategy: Strategy) {
    this.authStrategy = AuthStrategyFactory.create(strategy);
    this.userRepository = new UserRepository();
  }

  async register(userData: UserCreate) {
    return this.authStrategy.register(userData);
  }

  async login(userData: UserLogin): Promise<UserLoginResponse> {
    return this.authStrategy.authenticate(userData);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.userRepository.getAllUsers();
  }
  
}

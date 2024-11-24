import { IUser } from "../data-access/user.interface";
import { UserRepository } from "../data-access/user.repository";

export type UserResponse = Omit<IUser, "password">;

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.getAll(); 
    return users.map(user => {
      const { password, ...userWithoutPassword } = user.toObject(); 
      return userWithoutPassword as UserResponse;
    });
  }
}

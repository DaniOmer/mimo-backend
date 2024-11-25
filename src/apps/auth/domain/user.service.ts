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

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      return null; 
    }
    const { password, ...userWithoutPassword } = user.toObject(); 
    return userWithoutPassword as UserResponse;
  }

  async updateUserById(
    id: string,
    updateData: Partial<IUser>
  ): Promise<UserResponse | null> {
    const updatedUser = await this.userRepository.updateById(id, updateData);
    if (!updatedUser) {
      return null; 
    }
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword as UserResponse;
  }

}

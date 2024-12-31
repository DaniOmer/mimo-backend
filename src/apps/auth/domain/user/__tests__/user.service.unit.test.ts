import { UserService } from "../user.service";
import { UserRepository } from "../../../data-access";
import { IUser } from "../../../data-access/user/user.interface";
import BadRequestError from "../../../../../config/error/bad.request.config";

import { UserUpdateDTO } from "../user.dto";

jest.mock("../../../data-access/user/user.repository");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    (userService as any).repository = mockUserRepository;

    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return users without their passwords", async () => {
      const mockUsers = [
        { toObject: () => ({ _id: "1", email: "test1@example.com", password: "hashed1" }) },
        { toObject: () => ({ _id: "2", email: "test2@example.com", password: "hashed2" }) },
      ] as unknown as IUser[];

      mockUserRepository.getAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty("password");
      expect(result[1]).not.toHaveProperty("password");
      expect(mockUserRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserById", () => {
    it("should return a user without password if found", async () => {
      const mockUser = {
        toObject: () => ({ _id: "123", email: "test@example.com", password: "hashedPassword" }),
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await userService.getUserById("123");
      expect(result).toHaveProperty("_id", "123");
      expect(result).toHaveProperty("email", "test@example.com");
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.getById).toHaveBeenCalledWith("123");
    });

    it("should throw a BadRequestError if user not found", async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(userService.getUserById("unknownId")).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("unknownId");
    });
  });

  describe("updateUserById", () => {
    it("should update user and return it without password", async () => {
      const updateData: UserUpdateDTO = { firstName: "John", lastName: "Doe", email: "john.doe@example.com" };
      const mockUpdatedUser = {
        toObject: () => ({
          _id: "123",
          email: "john.doe@example.com",
          password: "hashedPassword",
          firstName: "John",
          lastName: "Doe",
        }),
      } as unknown as IUser;

      mockUserRepository.updateById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUserById("123", updateData);
      expect(result).toHaveProperty("_id", "123");
      expect(result).toHaveProperty("firstName", "John");
      expect(result).toHaveProperty("email", "john.doe@example.com");
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("123", updateData);
    });

    it("should throw BadRequestError if user is not found", async () => {
      const updateData: UserUpdateDTO = { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com" };

      mockUserRepository.updateById.mockResolvedValue(null);

      await expect(userService.updateUserById("unknownId", updateData)).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("unknownId", updateData);
    });
  });

  describe("deleteUserById", () => {
    it("should delete user and return the deleted user", async () => {
      const mockDeletedUser = {
        _id: "123",
        email: "deleted@example.com",
      } as unknown as IUser;

      mockUserRepository.deleteById.mockResolvedValue(mockDeletedUser);

      const result = await userService.deleteUserById("123");
      expect(result).toHaveProperty("_id", "123");
      expect(result).toHaveProperty("email", "deleted@example.com");
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith("123");
    });

    it("should throw BadRequestError if user is not found", async () => {
      mockUserRepository.deleteById.mockResolvedValue(null);

      await expect(userService.deleteUserById("unknownId")).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith("unknownId");
    });
  });
});

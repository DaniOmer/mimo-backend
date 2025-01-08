
import { UserService } from "../domain/";
import { UserRepository } from "../data-access/user/user.repository";
import { IUser, AuthType } from "../data-access/user/user.interface";
import  RoleService  from "../domain/role/role.service";
import { InvitationService } from "../domain/invitation/invitation.service";
import { SecurityUtils, UserDataToJWT } from "../../../utils";
import BadRequestError from "../../../config/error/bad.request.config";
import { UserUpdateDTO, PasswordUpdateDTO } from "../domain/user/user.dto";
import { IRole } from "../data-access/role/role.interface";
import { IPermission } from "../data-access/permission/permission.interface";

jest.mock("../data-access/user/user.repository");
jest.mock("../domain/role/role.service");
jest.mock("../domain/invitation/invitation.service");

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleService: jest.Mocked<RoleService>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockRoleService = new RoleService() as jest.Mocked<RoleService>;

    userService = new UserService();
    (userService as any).repository = mockUserRepository;
    (userService as any).roleService = mockRoleService;

    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users without their passwords", async () => {
      const mockUsers: Partial<IUser>[] = [
        {
          toObject: () => ({
            _id: "1",
            email: "user1@example.com",
            password: "hashedPassword1",
          }),
        },
        {
          toObject: () => ({
            _id: "2",
            email: "user2@example.com",
            password: "hashedPassword2",
          }),
        },
      ];

      mockUserRepository.getAllUsersWithDependencies.mockResolvedValue(
        mockUsers as IUser[]
      );

      const result = await userService.getAllUsers();
      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty("password");
      expect(result[1]).not.toHaveProperty("password");
      expect(mockUserRepository.getAllUsersWithDependencies).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("should return a user if found", async () => {
      const mockUser = {
        _id: "123",
        email: "test@example.com",
        password: "hashed",
        toObject: jest.fn().mockReturnValue({
          _id: "123",
          email: "test@example.com",
          password: "hashed",
        }),
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await userService.getById("123");
      expect(result).toBe(mockUser);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("123");
    });

    it("should throw BadRequestError if user is not found", async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(userService.getById("unknownId")).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("unknownId");
    });
  });

  describe("getUserById", () => {
    let mockCurrentUser: UserDataToJWT;

    beforeEach(() => {
      mockCurrentUser = {
        _id: "currentUser",
        id: {} as any,
        roles: [{ name: "user" }],
        permissions: [{ name: "READ" }],
      };
    });

    it("should return user without password if isOwnerOrAdmin returns true", async () => {
      const mockUser = {
        _id: "user123",
        email: "user@example.com",
        password: "hashedPassword",
        roles: [
          { _id: "role1", name: "user", createdAt: new Date(), updatedAt: new Date() },
        ],
        permissions: [
          { _id: "perm1", name: "READ", createdAt: new Date(), updatedAt: new Date() },
        ],
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          email: "user@example.com",
          password: "hashedPassword",
          roles: [
            { _id: "role1", name: "user", createdAt: new Date(), updatedAt: new Date() },
          ],
          permissions: [
            { _id: "perm1", name: "READ", createdAt: new Date(), updatedAt: new Date() },
          ],
        }),
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(true);

      const result = await userService.getUserById("user123", mockCurrentUser);
      expect(result._id).toBe("user123");
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.getById).toHaveBeenCalledWith("user123");
    });

    it("should throw BadRequestError if isOwnerOrAdmin returns false", async () => {
      const mockUser = {
        _id: "user123",
        email: "user@example.com",
        password: "hashedPassword",
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          email: "user@example.com",
          password: "hashedPassword",
        }),
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);
      jest.spyOn(SecurityUtils, "isOwnerOrAdmin").mockReturnValue(false);

      await expect(
        userService.getUserById("user123", mockCurrentUser)
      ).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("user123");
    });
  });

  describe("getUserByEmail", () => {
    it("should return user if found by email", async () => {
      const mockUser = {
        _id: "123",
        email: "test@example.com",
      } as IUser;

      mockUserRepository.getByEmail.mockResolvedValue(mockUser);
      const result = await userService.getUserByEmail("test@example.com");
      expect(result).toBe(mockUser);
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should return null if user not found", async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail("notfound@example.com");
      expect(result).toBeNull();
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith("notfound@example.com");
    });
  });

  describe("updateUserById", () => {
    it("should update user and return it without password", async () => {
      const updateData: UserUpdateDTO = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      const mockUpdatedUser = {
        _id: "123",
        email: "john.doe@example.com",
        password: "hashedPassword",
        toObject: jest.fn().mockReturnValue({
          _id: "123",
          email: "john.doe@example.com",
          password: "hashedPassword",
        }),
      } as unknown as IUser;

      mockUserRepository.updateById.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.getUserById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUserById("123", updateData);
      expect(result).toHaveProperty("_id", "123");
      expect(result).toHaveProperty("email", "john.doe@example.com");
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("123", updateData);
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith("123");
    });

    it("should throw BadRequestError if roles are invalid", async () => {
      const updateData: UserUpdateDTO = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        roles: [{ _id: "invalidRole", name: "invalid" } as IRole],
      };

      mockRoleService.getAllRoles.mockResolvedValue([
        { _id: "role1", name: "user" } as unknown as IRole,
      ]);

      await expect(userService.updateUserById("123", updateData)).rejects.toThrow(
        BadRequestError
      );
      expect(mockUserRepository.updateById).not.toHaveBeenCalled();
    });


    it("should throw BadRequestError if user cannot be populated after update", async () => {
      const mockUpdatedUser = {
        _id: "123",
        email: "test@example.com",
        toObject: jest.fn().mockReturnValue({
          _id: "123",
          email: "test@example.com",
        }),
      } as unknown as IUser;

      mockUserRepository.updateById.mockResolvedValue(mockUpdatedUser);
      mockUserRepository.getUserById.mockResolvedValue(null);

      await expect(
        userService.updateUserById("123", { firstName: "test", lastName: "test", email: "test@example.com"})
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("deleteUserById", () => {
    it("should delete user and return it without password", async () => {
      const mockDeletedUser = {
        _id: "123",
        email: "deleted@example.com",
        password: "hashed",
        toObject: jest.fn().mockReturnValue({
          _id: "123",
          email: "deleted@example.com",
          password: "hashed",
        }),
      } as unknown as IUser;

      mockUserRepository.deleteById.mockResolvedValue(mockDeletedUser);

      const result = await userService.deleteUserById("123");
      expect(result).toHaveProperty("_id", "123");
      expect(result).toHaveProperty("email", "deleted@example.com");
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith("123");
    });

    it("should throw BadRequestError if user not found", async () => {
      mockUserRepository.deleteById.mockResolvedValue(null);

      await expect(userService.deleteUserById("unknownId")).rejects.toThrow(
        BadRequestError
      );
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith("unknownId");
    });
  });

  describe("createUserFromInvitation", () => {
    it("should create user from invitation and return it without password", async () => {
      const mockInvitationService = {
        validateInvitation: jest.fn(),
        deleteInvitation: jest.fn(),
      } as any;
      const tokenHash = "validHash";
      const password = "PasswordValid123!";
      const isTermsOfSale = true;

      const invitationData = {
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        role: { _id: "role1", name: "user" },
        invitationId: "inv123",
      };

      const mockNewUser = {
        _id: "user123",
        email: "alice@example.com",
        password: "hashedNewPass",
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          email: "alice@example.com",
          password: "hashedNewPass",
        }),
      } as unknown as IUser;

      mockInvitationService.validateInvitation.mockResolvedValue(invitationData);
      jest.spyOn(SecurityUtils, "hashPassword").mockResolvedValue("hashedNewPass");
      mockUserRepository.create.mockResolvedValue(mockNewUser);

      const result = await userService.createUserFromInvitation(
        tokenHash,
        password,
        isTermsOfSale,
        mockInvitationService
      );
      expect(mockInvitationService.validateInvitation).toHaveBeenCalledWith(tokenHash);
      expect(SecurityUtils.hashPassword).toHaveBeenCalledWith(password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        password: "hashedNewPass",
        roles: [{ _id: "role1", name: "user" }],
        isTermsOfSale,
        isVerified: true,
        isDisabled: false,
        authType: AuthType.Basic,
      });
      expect(mockInvitationService.deleteInvitation).toHaveBeenCalledWith("inv123");
      expect(result).toHaveProperty("_id", "user123");
      expect(result).not.toHaveProperty("password");
    });
  });

  describe("changePassword", () => {
    it("should change the password if old password is valid", async () => {
      const userId = "user123";
      const mockUser = {
        _id: "user123",
        password: "oldHashedPass",
        toObject: jest.fn(),
      } as unknown as IUser;

      const passwordData: PasswordUpdateDTO = {
        oldPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      };

      mockUserRepository.getById.mockResolvedValue(mockUser);
      jest.spyOn(SecurityUtils, "comparePassword").mockResolvedValue(true);
      jest.spyOn(SecurityUtils, "hashPassword").mockResolvedValue("newHashedPass");
      mockUserRepository.updateById.mockResolvedValue({
        ...mockUser,
        password: "newHashedPass",
      } as IUser);

      const result = await userService.changePassword(passwordData, userId);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("user123");
      expect(SecurityUtils.comparePassword).toHaveBeenCalledWith(
        "OldPassword123!",
        "oldHashedPass"
      );
      expect(SecurityUtils.hashPassword).toHaveBeenCalledWith("NewPassword123!");
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("user123", {
        password: "newHashedPass",
      });
      expect(result.password).toBe("newHashedPass");
    });

    it("should throw BadRequestError if user not found", async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      await expect(
        userService.changePassword(
          { oldPassword: "old", newPassword: "new" },
          "unknownUser"
        )
      ).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.getById).toHaveBeenCalledWith("unknownUser");
    });

    it("should throw BadRequestError if old password is invalid", async () => {
      const mockUser = {
        _id: "user123",
        password: "oldHashedPass",
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);
      jest.spyOn(SecurityUtils, "comparePassword").mockResolvedValue(false);

      await expect(
        userService.changePassword(
          { oldPassword: "wrongOld", newPassword: "new" },
          "user123"
        )
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if updating password fails", async () => {
      const mockUser = {
        _id: "user123",
        password: "oldHashedPass",
      } as unknown as IUser;

      mockUserRepository.getById.mockResolvedValue(mockUser);
      jest.spyOn(SecurityUtils, "comparePassword").mockResolvedValue(true);
      jest.spyOn(SecurityUtils, "hashPassword").mockResolvedValue("newHashedPass");
      mockUserRepository.updateById.mockResolvedValue(null);

      await expect(
        userService.changePassword(
          { oldPassword: "OldPassword", newPassword: "NewPassword" },
          "user123"
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("toggleUserStatus", () => {
    it("should toggle user status and return updated user without password", async () => {
      const mockUpdatedUser = {
        _id: "user123",
        email: "user@example.com",
        isDisabled: true,
        password: "hashed",
        toObject: jest.fn().mockReturnValue({
          _id: "user123",
          email: "user@example.com",
          isDisabled: true,
          password: "hashed",
        }),
      } as unknown as IUser;

      mockUserRepository.updateById.mockResolvedValue(mockUpdatedUser);

      const result = await userService.toggleUserStatus("user123", true);
      expect(result).toHaveProperty("_id", "user123");
      expect(result).toHaveProperty("isDisabled", true);
      expect(result).not.toHaveProperty("password");
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("user123", {
        isDisabled: true,
      });
    });

    it("should throw BadRequestError if user not found", async () => {
      mockUserRepository.updateById.mockResolvedValue(null);
      await expect(userService.toggleUserStatus("unknownId", false)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("deleteMultipleUsers", () => {
    it("should delete multiple users and return their IDs", async () => {
      const ids = ["id1", "id2", "id3"];
      mockUserRepository.deleteById.mockImplementation((id: string) => {
        return Promise.resolve({
          _id: id,
          toObject: () => ({ _id: id }),
        } as unknown as IUser);
      });

      const result = await userService.deleteMultipleUsers(ids);
      expect(result).toEqual(["id1", "id2", "id3"]);
      expect(mockUserRepository.deleteById).toHaveBeenCalledTimes(3);
    });

    it("should throw BadRequestError if any user is not found", async () => {
      const ids = ["id1", "id2"];
      mockUserRepository.deleteById.mockImplementation((id: string) => {
        if (id === "id2") return Promise.resolve(null);
        return Promise.resolve({ _id: "id1" } as unknown as IUser);
      });

      await expect(userService.deleteMultipleUsers(ids)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("disableMultipleUsers", () => {
    it("should disable multiple users and return updated users as object", async () => {
      const ids = ["id1", "id2"];
      mockUserRepository.updateById.mockImplementation((id: string) => {
        return Promise.resolve({
          _id: id,
          email: `${id}@example.com`,
          password: "hashed",
          isDisabled: true,
          toObject: jest.fn().mockReturnValue({
            _id: id,
            email: `${id}@example.com`,
            password: "hashed",
            isDisabled: true,
          }),
        } as unknown as IUser);
      });

      const result = await userService.disableMultipleUsers(ids, true);
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe("id1");
      expect(result[1]._id).toBe("id2");
      expect(mockUserRepository.updateById).toHaveBeenCalledTimes(2);
    });

    it("should throw BadRequestError if any user is not found", async () => {
      const ids = ["id1", "id2"];
      mockUserRepository.updateById.mockImplementation((id: string) => {
        if (id === "id2") return Promise.resolve(null);
        return Promise.resolve({
          _id: "id1",
          toObject: () => ({ _id: "id1" }),
        } as unknown as IUser);
      });

      await expect(userService.disableMultipleUsers(ids, true)).rejects.toThrow(
        BadRequestError
      );
    });
  });
});

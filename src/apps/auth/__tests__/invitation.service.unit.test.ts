import { InvitationService } from "../domain/";
import { InvitationRepository } from "../data-access/invitation/invitation.repository";
import TokenService from "../domain/token/token.service";
import { UserService } from "../domain/user/user.service";
import BadRequestError from "../../../config/error/bad.request.config";
import { AppConfig } from "../../../config/app.config";
import { TokenType } from "../data-access/token/token.interface";
import { IInvitation } from "../data-access/invitation/invitation.interface";
import { IUser, AuthType } from "../data-access/user/user.interface";
import { Types } from "mongoose";
import { IRole } from "../data-access";

jest.mock("../data-access/invitation/invitation.repository");
jest.mock("../domain/token/token.service");
jest.mock("../domain/user/user.service");

describe("InvitationService", () => {
  let invitationService: InvitationService;
  let mockInvitationRepository: jest.Mocked<InvitationRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockTokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    mockInvitationRepository = new InvitationRepository() as jest.Mocked<InvitationRepository>;
    mockUserService = new UserService() as jest.Mocked<UserService>;
    mockTokenService = new TokenService() as jest.Mocked<TokenService>;

    invitationService = new InvitationService();
    (invitationService as any).invitationRepository = mockInvitationRepository;
    (invitationService as any).userService = mockUserService;
    (invitationService as any).tokenService = mockTokenService;

    jest.clearAllMocks();
  });

  describe("createInvitation", () => {
    it("should create an invitation and send an email", async () => {
      const firstName = "John";
      const lastName = "Doe";
      const email = "john.doe@example.com";
      const currentUserId = "adminUserId";
      const roleId = "roleId123";

      const mockUser = {
        _id: "adminUserId",
        email: "admin@example.com",
      } as IUser;

      const mockToken = {
        _id: "token123",
        hash: "fakeHash",
      } as any;

      mockUserService.getUserByEmail.mockResolvedValue(null); 
      mockInvitationRepository.findByEmail.mockResolvedValue(null); 
      mockUserService.getById.mockResolvedValue(mockUser);
      mockTokenService.createToken.mockResolvedValue(mockToken);

      const sendInvitationEmailSpy = jest.spyOn(
        invitationService as any,
        "sendInvitationEmail"
      ).mockResolvedValue(undefined);

      mockInvitationRepository.create.mockResolvedValue({} as any);

      await invitationService.createInvitation(
        firstName,
        lastName,
        email,
        currentUserId,
        roleId
      );

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(mockInvitationRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserService.getById).toHaveBeenCalledWith(currentUserId);
      expect(mockTokenService.createToken).toHaveBeenCalledWith(
        mockUser,
        TokenType.Invitation
      );
      expect(mockInvitationRepository.create).toHaveBeenCalledWith({
        firstName,
        lastName,
        email,
        admin: new Types.ObjectId(currentUserId),
        token: new Types.ObjectId(mockToken._id),
        role: new Types.ObjectId(roleId),
      });
      expect(sendInvitationEmailSpy).toHaveBeenCalledWith(
        email,
        firstName,
        `${AppConfig.client.url}/users/register?tokenHash=${mockToken.hash}`
      );
    });

    it("should throw an error if email is already in use", async () => {
      mockUserService.getUserByEmail.mockResolvedValue({} as IUser);

      await expect(
        invitationService.createInvitation(
          "John",
          "Doe",
          "existing@example.com",
          "adminUserId",
          "roleId"
        )
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw an error if an invitation already exists for this email", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);
      mockInvitationRepository.findByEmail.mockResolvedValue({} as IInvitation);

      await expect(
        invitationService.createInvitation(
          "John",
          "Doe",
          "existingInvitation@example.com",
          "adminUserId",
          "roleId"
        )
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw an error if currentUser is not found", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);
      mockInvitationRepository.findByEmail.mockResolvedValue(null);
      mockUserService.getById.mockResolvedValue(null as any);

      await expect(
        invitationService.createInvitation(
          "John",
          "Doe",
          "new@example.com",
          "invalidUser",
          "roleId"
        )
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("validateInvitation", () => {
    it("should validate an invitation and return necessary data", async () => {
      const tokenHash = "validTokenHash";
      const mockToken = { _id: "token123" } as any;
      const mockInvitation: Partial<IInvitation> = {
        _id: "inv123",
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        role: { _id: "role1", name: "user" } as IRole,
        token: mockToken._id,
      };

      mockTokenService.validateAndReturnToken.mockResolvedValue(mockToken);
      mockInvitationRepository.findByToken.mockResolvedValue(
        mockInvitation as IInvitation
      );

      const result = await invitationService.validateInvitation(tokenHash);
      expect(mockTokenService.validateAndReturnToken).toHaveBeenCalledWith(
        tokenHash,
        TokenType.Invitation
      );
      expect(mockInvitationRepository.findByToken).toHaveBeenCalledWith("token123");
      expect(result).toMatchObject({
        firstName: "Alice",
        lastName: "Wonderland",
        email: "alice@example.com",
        role: { _id: "role1", name: "user" },
        invitationId: "inv123",
      });
    });

    it("should throw an error if no invitation is found", async () => {
      mockTokenService.validateAndReturnToken.mockResolvedValue({ _id: "token123" } as any);
      mockInvitationRepository.findByToken.mockResolvedValue(null);

      await expect(
        invitationService.validateInvitation("someHash")
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("deleteInvitation", () => {
    it("should delete the invitation by ID", async () => {
      mockInvitationRepository.deleteById.mockResolvedValue({} as any);

      await expect(invitationService.deleteInvitation("inv123")).resolves.toBeUndefined();
      expect(mockInvitationRepository.deleteById).toHaveBeenCalledWith("inv123");
    });
  });
});

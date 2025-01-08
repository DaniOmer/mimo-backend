import { jest } from "@jest/globals";
import {
  AuthService,
  UserCreateResponse,
  UserLoginResponse,
} from "../../auth/domain/";
import { AuthStrategy } from "../../auth/domain/";
import { AuthStrategyFactory } from "../../auth/domain/";
import { UserRegisterDTO, UserLoginDTO } from "../../auth/domain/";
import { UserRepository } from "../../auth/data-access";
import TokenService from "../../auth/domain/token/token.service";
import { IToken, TokenType } from "../../auth/data-access/";
import { AuthType, IUser } from "../../auth/data-access/";
import BadRequestError from "../../../config/error/bad.request.config";
import { IRole } from "../../auth/data-access";
import { PreferenceService } from "../../preference/domain/preference.service";



jest.mock("../../../utils/security.utils", () => {
  const actual: any = jest.requireActual("../../../utils/security.utils");
  return {
    ...actual,
    hashPassword: jest.fn(() => Promise.resolve("mockHashedPassword")),
    comparePassword: jest.fn(),
  };
});

jest.mock("../../../config/app.config", () => ({
  AppConfig: {
    client: { url: "http://localhost" },
    notification: { email: { brevoApiKey: "mockBrevoApiKey" } },
    token: { defaultExpiresIn: "3600" },
  },
}));

jest.mock("../../auth/data-access/user/user.repository");
jest.mock("../../auth/domain/token/token.service");
jest.mock("../../auth/domain/auth/auth.factory");


jest.mock("../../preference/domain/preference.service", () => ({
  PreferenceService: jest.fn().mockImplementation(() => ({
    createDefaultPreference: jest.fn((...args: any[]) => Promise.resolve(undefined)),
  })),
}));

describe("AuthService (simple)", () => {
  let authService: AuthService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTokenService: jest.Mocked<TokenService>;

  let mockRegister: jest.MockedFunction<(data: any) => Promise<IUser>>;
  let mockAuthenticate: jest.MockedFunction<(data: any) => Promise<UserLoginResponse>>;
  let mockGetEmailValidationLink: jest.MockedFunction<(data: UserCreateResponse) => Promise<string>>;

  let mockAuthStrategy: AuthStrategy;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockTokenService = new TokenService() as jest.Mocked<TokenService>;

    mockRegister = jest.fn();
    mockAuthenticate = jest.fn();
    mockGetEmailValidationLink = jest.fn();

    mockAuthStrategy = {
      register: mockRegister,
      authenticate: mockAuthenticate,
      getEmailValidationLink: mockGetEmailValidationLink,
    } as unknown as AuthStrategy;

    (AuthStrategyFactory.create as jest.Mock).mockReturnValue(
      mockAuthStrategy
    );

    authService = new AuthService("basic");
    (authService as any).userRepository = mockUserRepository;
    (authService as any).tokenService = mockTokenService;

    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should authenticate a user and return login response", async () => {
      const userData: UserLoginDTO = {
        email: "john.doe@example.com",
        password: "Password123!",
      };

      const mockLoginRes: Partial<UserLoginResponse> = {
        _id: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        roles: [{ _id: "role1", name: "user" } as IRole],
        permissions: [],
        isVerified: true,
        isDisabled: false,
        isTermsOfSale: true,
        authType: AuthType.Basic,
        createdAt: new Date(),
        token: "mockToken",
        isDefaultPreference: false,
      };

      mockAuthenticate.mockResolvedValue(mockLoginRes as UserLoginResponse);

      const result = await authService.login(userData);

      expect(result).toEqual(mockLoginRes);
      expect(mockAuthenticate).toHaveBeenCalledWith(userData);
    });

    it("should throw an error if authentication fails", async () => {
      mockAuthenticate.mockRejectedValue(
        new BadRequestError({ message: "Invalid credentials" })
      );

      const userData: UserLoginDTO = {
        email: "john.doe@example.com",
        password: "WrongPassword",
      };

      await expect(authService.login(userData)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("confirmEmailRequest", () => {
    it("should confirm email if token is valid", async () => {
      const mockToken: IToken = {
        _id: "token123",
        user: "user123",
        hash: "validToken",
        type: TokenType.Confirmation,
        expiresAt: new Date(Date.now() + 60000),
        isDisabled: false,
      } as IToken;

      const mockUser: Partial<IUser> = {
        _id: "user123",
        email: "john@example.com",
        isVerified: false,
        isDisabled: false,
        authType: AuthType.Basic,
        password: "hashedpassword",
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const mockUpdated: Partial<IUser> = {
        ...mockUser,
        isVerified: true,
      };

      mockTokenService.validateAndReturnToken.mockResolvedValue(mockToken);
      mockUserRepository.getById.mockResolvedValue(mockUser as IUser);
      mockUserRepository.updateById.mockResolvedValue(mockUpdated as IUser);

      const expectedUpdatedUser: IUser = mockUpdated as IUser;

      const result = await authService.confirmEmailRequest("validToken");

      expect(result).toEqual(expectedUpdatedUser);
      expect(mockTokenService.validateAndReturnToken).toHaveBeenCalledWith(
        "validToken",
        TokenType.Confirmation
      );
      expect(mockUserRepository.getById).toHaveBeenCalledWith("user123");
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("user123", {
        isVerified: true,
      });
    });

    it("should throw error if token is invalid", async () => {
      mockTokenService.validateAndReturnToken.mockRejectedValue(
        new BadRequestError({ message: "Invalid token" })
      );

      await expect(authService.confirmEmailRequest("invalidToken")).rejects.toThrow(
        "Invalid token"
      );
    });
  });

  describe("requestPassswordReset", () => {
    it("should generate a reset password link if user is found (authType=basic)", async () => {
      const mockUser: Partial<IUser> = {
        _id: "user123",
        authType: AuthType.Basic,
        email: "john@example.com",
        isVerified: true,
        isDisabled: false,
        password: "hashedpassword",
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      mockUserRepository.getByEmail.mockResolvedValue(mockUser as IUser);
      mockTokenService.createToken.mockResolvedValue({
        hash: "mockHash",
      } as IToken);

      const result = await authService.requestPassswordReset("john@example.com");

      expect(result).toBe("http://localhost/auth/reset-password?token=mockHash");
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(mockTokenService.createToken).toHaveBeenCalledWith(
        mockUser,
        TokenType.PasswordReset
      );
    });

    it("should throw error if email not found", async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);

      await expect(
        authService.requestPassswordReset("unknown@example.com")
      ).rejects.toThrow("Email not found");
    });
  });
});
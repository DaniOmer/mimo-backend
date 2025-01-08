import { jest } from "@jest/globals";
import {
  AuthService,
  UserCreateResponse,
  UserLoginResponse,
} from "../auth.service";
import { AuthStrategy } from "../auth.strategy";
import { AuthStrategyFactory } from "../auth.factory";
import { UserRegisterDTO, UserLoginDTO } from "../../user/user.dto";
import { UserRepository } from "../../../data-access/user/user.repository";
import TokenService from "../../token/token.service";
import { TokenType } from "../../../data-access/token/token.interface";
import { AuthType } from "../../../data-access/user/user.interface";
import BadRequestError from "../../../../../config/error/bad.request.config";

jest.mock("../../../data-access/user/user.repository");
jest.mock("../../token/token.service");
jest.mock("../auth.factory");
jest.mock("../../../../../utils/security.utils");
jest.mock("../../../../../config/app.config", () => ({
  AppConfig: {
    client: { url: "http://localhost" },
    notification: { email: { brevoApiKey: "mockBrevoApiKey" } },
  },
}));

describe("AuthService", () => {
  let authService: AuthService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTokenService: jest.Mocked<TokenService>;

  let mockRegister: jest.MockedFunction<(data: any) => Promise<UserCreateResponse>>;
  let mockAuthenticate: jest.MockedFunction<(data: any) => Promise<UserLoginResponse>>;
  let mockRequestEmailValidation: jest.MockedFunction<
    (data: UserCreateResponse) => Promise<string>
  >;

  let mockAuthStrategy: jest.Mocked<AuthStrategy>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockTokenService = new TokenService() as jest.Mocked<TokenService>;

    mockRegister = jest.fn<(data: any) => Promise<UserCreateResponse>>();
    mockAuthenticate = jest.fn<(data: any) => Promise<UserLoginResponse>>();
    mockRequestEmailValidation = jest.fn<(data: UserCreateResponse) => Promise<string>>();

    mockAuthStrategy = {
      register: mockRegister,
      authenticate: mockAuthenticate,
      requestEmailValidation: mockRequestEmailValidation,
    } as jest.Mocked<AuthStrategy>;

    jest.spyOn(AuthStrategyFactory, "create").mockReturnValue(mockAuthStrategy);

    authService = new AuthService("basic");

    (authService as any).userRepository = mockUserRepository;
    (authService as any).tokenService = mockTokenService;

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user and send email confirmation", async () => {
      const userData: UserRegisterDTO = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        roles: ["user"],
        isTermsOfSale: true,
        authType: AuthType.Basic,
      };

      const mockResponse = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        roles: [],
        permissions: [],
        isTermsOfSale: true,
        isVerified: false,
        isDisabled: false,
        authType: AuthType.Basic,
        createdAt: new Date(),
      } as unknown as UserCreateResponse;

      mockRegister.mockResolvedValue(mockResponse);
      mockRequestEmailValidation.mockResolvedValue("http://confirmation-link");

      const result = await authService.register(userData);

      expect(result).toEqual(mockResponse);
      expect(mockRegister).toHaveBeenCalledWith(userData);
      expect(mockRequestEmailValidation).toHaveBeenCalledWith(mockResponse);
    });

    it("should throw an error if registration fails", async () => {
      const userData: UserRegisterDTO = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        roles: ["user"],
        isTermsOfSale: true,
        authType: AuthType.Basic,
      };

      mockRegister.mockRejectedValue(new BadRequestError({ message: "Registration failed" }));
      await expect(authService.register(userData)).rejects.toThrow("Registration failed");
    });
  });

  describe("login", () => {
    it("should authenticate a user and return login response", async () => {
      const userData: UserLoginDTO = {
        email: "john.doe@example.com",
        password: "Password123!",
      };

      const mockLoginResponse = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        roles: [],
        permissions: [],
        isVerified: true,
        isDisabled: false,
        isTermsOfSale: true,
        authType: AuthType.Basic,
        createdAt: new Date(),
        token: "mockToken",
      } as unknown as UserLoginResponse;

      mockAuthenticate.mockResolvedValue(mockLoginResponse);

      const result = await authService.login(userData);
      expect(result).toEqual(mockLoginResponse);
      expect(mockAuthenticate).toHaveBeenCalledWith(userData);
    });

    it("should throw an error if authentication fails", async () => {
      const userData: UserLoginDTO = {
        email: "john.doe@example.com",
        password: "WrongPassword",
      };

      mockAuthenticate.mockRejectedValue(
        new BadRequestError({ message: "Invalid credentials" })
      );

      await expect(authService.login(userData)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("confirmEmailRequest", () => {
    it("should confirm email if token is valid", async () => {
      const mockTokenUser = {
        _id: "123",
        email: "john.doe@example.com",
        isVerified: false,
      };
      const mockUpdatedUser = { ...mockTokenUser, isVerified: true };

      mockTokenService.validateTokenAndReturnUser.mockResolvedValue(mockTokenUser as any);
      mockUserRepository.updateById.mockResolvedValue(mockUpdatedUser as any);

      const result = await authService.confirmEmailRequest("validToken");

      expect(result).toEqual(mockUpdatedUser);
      expect(mockTokenService.validateTokenAndReturnUser).toHaveBeenCalledWith(
        "validToken",
        TokenType.Confirmation
      );
      expect(mockUserRepository.updateById).toHaveBeenCalledWith("123", { isVerified: true });
    });

    it("should throw an error if token is invalid", async () => {
      mockTokenService.validateTokenAndReturnUser.mockRejectedValue(
        new BadRequestError({ message: "Invalid token" })
      );

      await expect(authService.confirmEmailRequest("invalidToken")).rejects.toThrow("Invalid token");
    });
  });

  describe("requestPassswordReset", () => {
    it("should generate a reset password link if email exists", async () => {
      const mockUser = {
        _id: "123",
        email: "john.doe@example.com",
        authType: AuthType.Basic,
        roles: [],
        permissions: [],
        isTermsOfSale: false,
        isVerified: true,
        isDisabled: false,
        password: "hashedPassword",
        firstName: "John",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnValue({
          _id: "123",
          email: "john.doe@example.com",
          authType: AuthType.Basic,
          roles: [],
          permissions: [],
          isTermsOfSale: false,
          isVerified: true,
          isDisabled: false,
          password: "hashedPassword",
          firstName: "John",
          lastName: "Doe",
        }),
      };

      mockUserRepository.getByEmail.mockResolvedValue(mockUser as any);
      mockTokenService.createToken.mockResolvedValue({ hash: "mockHash" } as any);

      const result = await authService.requestPassswordReset("john.doe@example.com");

      expect(result).toBe("http://localhost/auth/reset-password?token=mockHash");
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith("john.doe@example.com");
      expect(mockTokenService.createToken).toHaveBeenCalledWith(
        mockUser,
        TokenType.PasswordReset
      );
    });

    it("should throw an error if email does not exist", async () => {
      mockUserRepository.getByEmail.mockResolvedValue(null);

      await expect(
        authService.requestPassswordReset("unknown@example.com")
      ).rejects.toThrow("Email not found");
    });
  });
});

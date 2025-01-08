import TokenService from "../domain/token/token.service";
import TokenRepository from "../data-access/token/token.repository";
import { IToken, TokenType } from "../data-access/token/token.interface";
import { IUser } from "../data-access/user/user.interface";
import BadRequestError from "../../../config/error/bad.request.config";
import { SecurityUtils } from "../../../utils/security.utils";
import { AppConfig } from "../../../config/app.config";

jest.mock("../data-access/token/token.repository");

jest.mock("../../../utils/security.utils", () => ({
  ...jest.requireActual("../../../utils/security.utils"),
  generateRandomToken: jest.fn(),
}));

describe("TokenService", () => {
  let tokenService: TokenService;
  let mockTokenRepository: jest.Mocked<TokenRepository>;
  let mockGenerateRandomToken: jest.Mock;

  beforeEach(() => {
    mockTokenRepository = new TokenRepository() as jest.Mocked<TokenRepository>;
    tokenService = new TokenService();
    (tokenService as any).tokenRepository = mockTokenRepository;

    mockGenerateRandomToken = SecurityUtils.generateRandomToken as jest.Mock;

    jest.clearAllMocks();
  });

  describe("validateAndReturnToken", () => {
    it("should throw an error if token does not exist or has the wrong type", async () => {
      mockTokenRepository.getByHash.mockResolvedValue(null);

      await expect(
        tokenService.validateAndReturnToken("fakeHash", TokenType.Confirmation)
      ).rejects.toThrow(BadRequestError);
      expect(mockTokenRepository.getByHash).toHaveBeenCalledWith("fakeHash");
    });

    it("should throw an error if token type does not match", async () => {
      const mockToken: IToken = {
        _id: "token123",
        type: TokenType.PasswordReset,
        user: "user123",
        hash: "wrongTypeHash",
        expiresAt: new Date(Date.now() + 60_000),
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);

      await expect(
        tokenService.validateAndReturnToken("wrongTypeHash", TokenType.Confirmation)
      ).rejects.toThrow(BadRequestError);
      expect(mockTokenRepository.getByHash).toHaveBeenCalledWith("wrongTypeHash");
    });


    it("should throw an error if token is disabled", async () => {
      const mockToken: IToken = {
        _id: "token123",
        type: TokenType.PasswordReset,
        user: "user123",
        hash: "disabledHash",
        expiresAt: new Date(Date.now() + 60_000),
        isDisabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);

      await expect(
        tokenService.validateAndReturnToken("disabledHash", TokenType.PasswordReset)
      ).rejects.toThrow(BadRequestError);
      expect(mockTokenRepository.getByHash).toHaveBeenCalledWith("disabledHash");
    });

    it("should disable the token and return the updated token if everything is ok", async () => {
      const mockToken: IToken = {
        _id: "token123",
        type: TokenType.Confirmation,
        user: "user123",
        hash: "validHash",
        expiresAt: new Date(Date.now() + 60_000),
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IToken;

      const updatedToken: IToken = {
        ...mockToken,
        isDisabled: true,
      } as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);
      mockTokenRepository.updateById.mockResolvedValue(updatedToken);

      const result = await tokenService.validateAndReturnToken(
        "validHash",
        TokenType.Confirmation
      );
      expect(result).toEqual(updatedToken);
      expect(mockTokenRepository.updateById).toHaveBeenCalledWith("token123", {
        isDisabled: true,
      });
    });

    it("should throw an error if token cannot be updated", async () => {
      const mockToken: IToken = {
        _id: "token123",
        type: TokenType.Confirmation,
        user: "user123",
        hash: "validHash",
        expiresAt: new Date(Date.now() + 60_000),
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);
      mockTokenRepository.updateById.mockResolvedValue(null);

      await expect(
        tokenService.validateAndReturnToken("validHash", TokenType.Confirmation)
      ).rejects.toThrow(BadRequestError);
      expect(mockTokenRepository.updateById).toHaveBeenCalledWith("token123", {
        isDisabled: true,
      });
    });
  });
});

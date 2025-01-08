import TokenService from "../token.service";
import TokenRepository from "../../../data-access/token/token.repository";
import { IToken, TokenType } from "../../../data-access/token/token.interface";
import { IUser } from "../../../data-access/user/user.interface";
import BadRequestError from "../../../../../config/error/bad.request.config";

jest.mock("../../../data-access/token/token.repository");
jest.mock("../../../../../utils/security.utils", () => ({
  ...jest.requireActual("../../../../../utils/security.utils"),
  generateRandomToken: jest.fn().mockResolvedValue("mockRandomString"),
}));

describe("TokenService", () => {
  let tokenService: TokenService;
  let mockTokenRepository: jest.Mocked<TokenRepository>;

  beforeEach(() => {
    mockTokenRepository = new TokenRepository() as jest.Mocked<TokenRepository>;
    tokenService = new TokenService();
    (tokenService as any).tokenRepository = mockTokenRepository;

    jest.clearAllMocks();
  });

  describe("createToken", () => {
    it("should create a token with a given user and type", async () => {
      const mockUser = { _id: "user123" } as IUser;
      const expiresIn = 3600;
      const mockToken = {
        _id: "tokenId",
        user: mockUser._id,
        hash: "mockRandomString",
        type: TokenType.Confirmation,
        expiresAt: new Date(),
      } as IToken;

      mockTokenRepository.create.mockResolvedValue(mockToken);

      const result = await tokenService.createToken(
        mockUser,
        TokenType.Confirmation,
        expiresIn
      );
      expect(result.hash).toBe("mockRandomString");
      expect(result.type).toBe(TokenType.Confirmation);
      expect(mockTokenRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if expiresAt is invalid (NaN)", async () => {
      const mockUser = { _id: "user123" } as IUser;
      const invalidExpiresIn = NaN;

      await expect(
        tokenService.createToken(mockUser, TokenType.PasswordReset, invalidExpiresIn)
      ).rejects.toThrow(BadRequestError);
      expect(mockTokenRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("validateTokenAndReturnUser", () => {
    it("should throw an error if token does not exist or has wrong type", async () => {
      mockTokenRepository.getByHash.mockResolvedValue(null);

      await expect(
        tokenService.validateTokenAndReturnUser("fakehash", TokenType.Confirmation)
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw an error if token is expired or disabled", async () => {
      const mockToken = {
        _id: "tokenId",
        type: TokenType.PasswordReset,
        expiresAt: new Date(Date.now() - 60_000), 
        isDisabled: false,
      } as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);
      await expect(
        tokenService.validateTokenAndReturnUser("fakehash", TokenType.PasswordReset)
      ).rejects.toThrow(BadRequestError);

      mockToken.expiresAt = new Date(Date.now() + 60_000); 
      mockToken.isDisabled = true;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);
      await expect(
        tokenService.validateTokenAndReturnUser("fakehash", TokenType.PasswordReset)
      ).rejects.toThrow(BadRequestError);
    });

    it("should disable the token and return the user if everything is ok", async () => {
      const mockToken = {
        _id: "tokenId",
        type: TokenType.Confirmation,
        expiresAt: new Date(Date.now() + 60_000), 
        isDisabled: false,
        user: "userId123",
      } as unknown as IToken;

      mockTokenRepository.getByHash.mockResolvedValue(mockToken);
      mockTokenRepository.updateById.mockResolvedValue({
        ...mockToken,
        isDisabled: true,
      } as IToken);

      const result = await tokenService.validateTokenAndReturnUser(
        "fakehash",
        TokenType.Confirmation
      );
      expect(result).toBe("userId123");
      expect(mockTokenRepository.updateById).toHaveBeenCalledWith("tokenId", {
        isDisabled: true,
      });
    });
  });
});

import { AppConfig } from "../../../../config/app.config";
import { IUser, IToken, TokenType } from "../../data-access";
import { BaseService } from "../../../../librairies/services";
import { SecurityUtils } from "../../../../utils/security.utils";
import TokenRepository from "../../data-access/token/token.repository";
import BadRequestError from "../../../../config/error/bad.request.config";

export default class TokenService extends BaseService {
  readonly tokenRepository: TokenRepository;

  constructor() {
    super("Token");
    this.tokenRepository = new TokenRepository();
  }

  async createToken(
    user: IUser,
    type: TokenType,
    expiresIn: number = Number(AppConfig.token.defaultExpiresIn)
  ): Promise<IToken> {
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
    const tokenHash = await SecurityUtils.generateRandomToken();

    if (isNaN(expiresAt.getTime())) {
      throw new BadRequestError({
        logging: true,
        context: { token: "Invalid expiration time" },
      });
    }

    const token = await this.tokenRepository.create({
      user: user._id,
      hash: tokenHash,
      type,
      expiresAt,
    });
    return token;
  }

  async validateTokenAndReturnUser(
    hash: string,
    tokenType: TokenType
  ): Promise<IUser | string> {
    const existingToken = await this.tokenRepository.getByHash(hash);
    if (!existingToken || existingToken.type !== tokenType) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_token: "Invalid token" },
      });
    }

    if (
      existingToken.expiresAt.getTime() < Date.now() ||
      existingToken.isDisabled
    ) {
      throw new BadRequestError({
        logging: true,
        context: { reset_password_token: "Token expired" },
      });
    }

    const updatedToken = await this.tokenRepository.updateById(
      existingToken._id,
      {
        isDisabled: true,
      }
    );

    if (!updatedToken) {
      throw new BadRequestError({
        logging: true,
        context: { validate_token: "Failed to update token" },
      });
    }

    return updatedToken.user;
  }
}

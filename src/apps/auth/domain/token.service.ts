import { BaseService } from "../../../librairies/services";
import { IUser } from "../data-access/user.interface";
import { IToken, TokenType } from "../data-access/token.interface";
import { SecurityUtils } from "../../../utils/security.utils";
import { AppConfig } from "../../../config/app.config";
import TokenRepository from "../data-access/token.repository";
import BadRequestError from "../../../config/error/bad.request.config";

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
}

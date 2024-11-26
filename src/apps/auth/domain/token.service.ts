import { BaseService } from "../../../librairies/services";
import { IUser } from "../data-access/user.interface";
import { IToken, TokenType } from "../data-access/token.interface";
import { SecurityUtils } from "../../../utils/security.utils";
import { AppConfig } from "../../../config/app.config";
import TokenRepository from "../data-access/token.repository";
import BadRequestError from "../../../config/error/bad.request.config";
import { UserService } from "./user.service";
import UserRepository from "../data-access/user.repository";

export default class TokenService extends BaseService {
  readonly tokenRepository: TokenRepository;
  readonly userService: UserService;
  readonly userRepository: UserRepository;

  constructor() {
    super("Token");
    this.tokenRepository = new TokenRepository();
    this.userService = new UserService();
    this.userRepository = new UserRepository();
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

  async validateToken(
    token: string,
    tokenType: TokenType
  ): Promise<IUser | string> {
    const existingHash = await this.tokenRepository.getByhash(token);
    if (!existingHash || existingHash.type !== tokenType) {
      throw new BadRequestError({
        logging: true,
        context: { token: "Invalid token" },
      });
    }
    console.log(existingHash.expiresAt.getMilliseconds());
    console.log(Date.now());
    if (existingHash.expiresAt.getTime() < Date.now()) {
      throw new BadRequestError({
        logging: true,
        context: { token: "Token expired" },
      });
    }

    return existingHash.user;
  }
}

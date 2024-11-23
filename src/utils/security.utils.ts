import crypto from "crypto";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppConfig } from "../config/app.config";
import BadRequestError from "../config/error/bad.request.config";

export class SecurityUtils {
  static generateSecret(): string {
    return crypto.randomBytes(32).toString("base64");
  }

  static getJWTSecret(): string {
    const secret = AppConfig.jwt.secret;
    if (!secret) {
      throw new BadRequestError({
        code: 500,
        message: "Missing JWT secret",
        logging: true,
      });
    }
    return secret;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(
    inputPassword: string,
    storedPasswordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPasswordHash);
  }

  static async generateToken(userId: string): Promise<string> {
    const secret = this.getJWTSecret();
    return jwt.sign({ userId }, secret, {
      algorithm: "HS256",
      expiresIn: AppConfig.jwt.expiresIn,
    });
  }

  static async verifyToken(token: string): Promise<string | JwtPayload> {
    const secret = this.getJWTSecret();
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decode) => {
        if (error) {
          throw new BadRequestError({
            code: 401,
            message: "Invalid token",
            logging: true,
          });
        } else {
          resolve(decode as string | JwtPayload);
        }
      });
    });
  }
}

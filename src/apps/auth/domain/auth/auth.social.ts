import { AuthStrategy } from "./auth.strategy";
import BadRequestError from "../../../../config/error/bad.request.config";

export class SocialAuthStrategy implements AuthStrategy {
  async register(data: any): Promise<any> {
    throw new BadRequestError({
      message: "Social authentication not supported",
      context: { authentication: "Social authentication not supported" },
      logging: true,
    });
  }

  async authenticate(data: any): Promise<any> {
    throw new BadRequestError({
      message: "Social authentication not supported",
      context: { authentication: "Social authentication not supported" },
      logging: true,
    });
  }
}

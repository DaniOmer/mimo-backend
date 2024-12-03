import { AuthStrategy } from "./auth.strategy";
import BadRequestError from "../../../config/error/bad.request.config";

export class SocialAuthStrategy implements AuthStrategy {
  async register(data: any): Promise<any> {
    throw new Error("This strategy is not implemented yet");
  }

  async authenticate(data: any): Promise<any> {
    throw new Error("This strategy is not implemented yet");
  }
}

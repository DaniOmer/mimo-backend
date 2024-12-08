import { AuthStrategy } from "./auth.strategy";
import { BasicAuthStrategy } from "./auth.basic";
import { SocialAuthStrategy } from "./auth.social";

export type Strategy = "basic" | "social";

export class AuthStrategyFactory {
  static create(strategy: Strategy): AuthStrategy {
    switch (strategy) {
      case "basic":
        return new BasicAuthStrategy();
      case "social":
        return new SocialAuthStrategy();
      default:
        throw new Error("Invalid authentication strategy");
    }
  }
}

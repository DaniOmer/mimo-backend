import { createHash } from "crypto";

export class SecurityUtils {
  static sha512(str: string): string {
    return createHash("SHA512").update(str).digest("hex");
  }
}

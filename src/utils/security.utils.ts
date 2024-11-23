import * as bcrypt from "bcrypt";

export class SecurityUtils {
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
}

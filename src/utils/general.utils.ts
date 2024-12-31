import crypto from "crypto";

export class GeneralUtils {
  static generateUniqueIdentifier(prefix: string): string {
    // const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const datePart = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const uniquePart = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${prefix}-${datePart}-${uniquePart}`;
  }
}

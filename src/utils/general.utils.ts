import crypto from "crypto";

export class GeneralUtils {
  static generateUniqueIdentifier(prefix: string): string {
    // const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const datePart = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const uniquePart = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${prefix}-${datePart}-${uniquePart}`;
  }

  static calculatePriceWithTax(priceHT: number, tvaRate: number = 20): number {
    if (priceHT < 0) {
      throw new Error("Price HT must be a positive value.");
    }

    const tvaMultiplier = 1 + tvaRate / 100;
    return parseFloat((priceHT * tvaMultiplier).toFixed(2));
  }
}



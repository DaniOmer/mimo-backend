import crypto from "crypto";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

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

  static htmlTemplateReader(
    templateName: string,
    data: Record<string, any> | null = null
  ) {
    const templatePath = path.join(__dirname, "../templates", templateName);
    const templateContent = fs.readFileSync(templatePath, "utf-8");

    if (!data) {
      return templateContent;
    }
    const template = Handlebars.compile(templateContent);
    return template(data);
  }
}



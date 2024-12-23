import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import Handlebars from "handlebars";

export class GeneralUtils {
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

  static generateUniqueIdentifier(prefix: string): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const uniquePart = crypto.randomBytes(4).toString("hex").toUpperCase();
    return `${prefix}-${datePart}-${uniquePart}`;
  }
}

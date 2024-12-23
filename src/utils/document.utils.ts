import puppeteer from "puppeteer-core";

export class DocumentUtils {
  static async createPdfFromHTML(html: string): Promise<any> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();
  }
}

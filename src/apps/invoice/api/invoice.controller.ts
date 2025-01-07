import { Request, Response, NextFunction } from "express";

import { BaseController } from "../../../librairies/controllers";
import { ApiResponse } from "../../../librairies/controllers";
import { InvoiceService } from "../domain/invoice.service";

export class InvoiceController extends BaseController {
  private invoiceService : InvoiceService ;
  constructor() {
    super();
    this.invoiceService = new InvoiceService();

  }

  async getAllInvoices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

  async getInvoiceById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

  async deleteInvoice(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

  async generateInvoicePDF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { invoiceId } = req.params;
    try {
      const pdf = await this.invoiceService.generateInvoicePDF(invoiceId);
      res.contentType("application/pdf");
      ApiResponse.success(res, "Invoice PDF generated successfully", pdf, 200);
    } catch (error) {
      next(error);
    }
  }


  async sendInvoiceEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId } = req.params;
      await this.invoiceService.sendInvoiceByEmail(invoiceId);  
      ApiResponse.success(res, "Invoice sent successfully", null, 200);   
    } catch (error) {
      next(error);
    }
  }
}

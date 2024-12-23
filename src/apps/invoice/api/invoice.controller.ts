import { Request, Response, NextFunction } from "express";

import { BaseController } from "../../../librairies/controllers";
import { ApiResponse } from "../../../librairies/controllers";
import { InvoiceService } from "../domain/invoice.service";

export class InvoiceController extends BaseController {
  constructor() {
    super();
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
  ): Promise<void> {}
}

import { BaseService } from "../../../librairies/services";
import BadRequestError from "../../../config/error/bad.request.config";
import { InvoiceRepository } from "../data-access/invoice.repository";
import { IInvoice } from "../data-access/invoice.interface";
import { GeneralUtils } from "../../../utils/general.utils";
import { DocumentUtils } from "../../../utils/document.utils";

export class InvoiceService extends BaseService {
  readonly repository: InvoiceRepository;
  constructor() {
    super("Invoice");
    this.repository = new InvoiceRepository();
  }

  async createInvoice(
    data: Omit<IInvoice, "_id" | "invoiceNumber">
  ): Promise<IInvoice> {
    const number = GeneralUtils.generateUniqueIdentifier("INV");
    const invoice = await this.repository.create({ ...data, number });
    if (!invoice) {
      throw new BadRequestError({
        message: "Something went wrong when creating invoice",
        logging: true,
      });
    }
    return invoice;
  }

  async generateInvoicePDF(invoiceId: string): Promise<any> {
    const invoice = await this.repository.getInvoiceWithRelations(invoiceId);
    if (!invoice) {
      throw new BadRequestError({
        message: "Invoice not found",
        code: 404,
        logging: true,
      });
    }
    // IMPLEMENT THIS AFTER ORDER AND ORDER ITEM SERVICE READY
    const orderId = invoice.payment.orderId;
    const order = await this.orderService.getOrderId(orderId);
    if (!order) {
      throw new BadRequestError({
        message: "Order not found",
        code: 404,
        logging: true,
      });
    }

    const orderItems = await this.orderItemService.getOrderItemsWithProducts(
      order
    );
    const items = orderItems.map((item: IOrderItem, index: number) => ({
      itemNumber: index + 1,
      productName: item.product.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subTotal: item.quantity * item.unitPrice,
      subTotalAndVat: item.quantity * item.unitPrice * 0.2,
    }));

    const pdfData = {
      invoice: invoice,
      customer: invoice.user,
      order: order,
      items: items,
    };
    // Generate PDF from HTML template here
    const templateName = "invoice-template.html";
    const html = GeneralUtils.htmlTemplateReader(templateName, pdfData);
    await DocumentUtils.createPdfFromHTML(html);
  }
}

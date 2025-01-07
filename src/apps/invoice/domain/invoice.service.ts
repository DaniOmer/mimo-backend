import { BaseService } from "../../../librairies/services";
import BadRequestError from "../../../config/error/bad.request.config";
import { InvoiceRepository } from "../data-access/invoice.repository";
import { IInvoice } from "../data-access/invoice.interface";
import { GeneralUtils } from "../../../utils/general.utils";
import { DocumentUtils } from "../../../utils/document.utils";
import { OrderService } from "../../order/order/domain";
import { OrderItemService } from "../../order/orderItem/domain";
import { IOrderItem } from "../../order/orderItem/data-access";
import { IProduct } from "../../product/data-access";
import { IOrder } from "../../order/order/data-access";

export class InvoiceService extends BaseService {
  readonly repository: InvoiceRepository;
  readonly orderService: OrderService;
  readonly orderItemService: OrderItemService;

  constructor() {
    super("Invoice");
    this.repository = new InvoiceRepository();
    this.orderService = new OrderService();
    this.orderItemService = new OrderItemService();
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


  async generateInvoicePDF(invoiceId: string): Promise<Buffer> {
    const invoice = await this.repository.getInvoiceWithRelations(invoiceId);
    if (!invoice) {
      throw new BadRequestError({
        message: "Invoice not found",
        code: 404,
        logging: true,
      });
    }

    const orderFromInvoice= invoice.payment.order as IOrder;

    const orderId = orderFromInvoice._id.toString();
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new BadRequestError({
        message: "Order not found",
        code: 404,
        logging: true,
      });
    }

    const orderItems = await this.orderItemService.getOrderItemsByOrderId(order._id.toString());
    const items = orderItems.map((item: IOrderItem, index: number) => {
      const product = item.product as IProduct;
     return {
        itemNumber: index + 1,
        productName: product.name, 
        unitPrice: item.priceVat,
        quantity: item.quantity,
        subTotal: item.quantity * item.priceVat,
        subTotalAndVat: item.quantity * item.priceVat * 1.2, 
      }
    });

    const pdfData = {
      invoice: invoice,
      customer: invoice.user,
      order: order,
      items: items,
    };

    const templateName = "invoice-template.html"; 
    const html = GeneralUtils.htmlTemplateReader(templateName, pdfData);

    const pdfBuffer = await DocumentUtils.createPdfFromHTML(html);
    return pdfBuffer;
  }

  async sendInvoiceByEmail(invoiceId: string): Promise<void> {
    const invoice = await this.repository.getInvoiceWithRelations(invoiceId);
    if (!invoice) {
      throw new BadRequestError({
        message: "Invoice not found",
        code: 404,
        logging: true,
      });
    }

    const pdfBuffer = await this.generateInvoicePDF(invoiceId);

    await this.emailNotifier.send({
      recipient: invoice.user.email,           
      subject: `Votre facture #${invoice.number}`,
      templateName: "invoice-email.html",      
      params: {
        client_name: invoice.user.firstName,
      },
      attachments: [
        {
          filename: `facture-${invoice.number}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  }
}

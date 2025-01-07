import { MongooseRepository } from "../../../librairies/repositories";
import { InvoiceModel } from "./invoice.model";
import { IInvoice } from "./invoice.interface";

export class InvoiceRepository extends MongooseRepository<IInvoice> {
  constructor() {
    super(InvoiceModel);
  }

  async getInvoiceWithRelations(id: string): Promise<IInvoice | null> {
    return this.model.findById(id).populate("user").populate("payment").exec();
  }
}

import { IPayment } from "./payment.interface";
import { PaymentModel } from "./payment.model";
import { MongooseRepository } from "../../../../librairies/repositories";

export class PaymentRepository extends MongooseRepository<IPayment> {
  constructor() {
    super(PaymentModel);
  }
}

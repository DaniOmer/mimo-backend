import { MongooseRepository } from "../../../../librairies/repositories";
import {
  IPaymentMethod,
  ICardDetails,
  IPayPalDetails,
} from "./method.interface";
import {
  PaymentMethodModel,
  CardPaymentMethodModel,
  PayPalPaymentMethodModel,
} from "./method.model";

export class PaymentMethodRepository extends MongooseRepository<IPaymentMethod> {
  constructor() {
    super(PaymentMethodModel);
  }

  async createCardPaymentMethod(
    details: ICardDetails
  ): Promise<ICardDetails | null> {
    const cardPaymentMethod = new CardPaymentMethodModel(details);
    return cardPaymentMethod.save();
  }

  async createPayPalPaymentMethod(
    details: IPayPalDetails
  ): Promise<IPayPalDetails | null> {
    const payPalPaymentMethod = new PayPalPaymentMethodModel(details);
    return payPalPaymentMethod.save();
  }

  async getByCustomer(customerId: string) {
    return this.model.find({ customer: customerId }).exec();
  }

  async unsetDefaultForCustomer(customerId: string) {
    return this.model.updateMany(
      { customer: customerId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
}

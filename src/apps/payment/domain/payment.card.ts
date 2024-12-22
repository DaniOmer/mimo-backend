import Stripe from "stripe";
import PaymentStrategy from "./payment.strategy";
import {
  StripeProvider,
  CreatePaymentIntentParams,
  ConfirmPaymentIntentParams,
} from "../../../config/store";
import { PaymentMethodRepository } from "../data-access/method/method.repository";
import { ICardDetails } from "../data-access/method/method.interface";
import BadRequestError from "../../../config/error/bad.request.config";

export class CardPayment implements PaymentStrategy {
  readonly provider: StripeProvider;
  readonly paymentMethodRepository: PaymentMethodRepository;

  constructor() {
    this.provider = new StripeProvider();
    this.paymentMethodRepository = new PaymentMethodRepository();
  }

  async addPaymentMethod(data: ICardDetails): Promise<ICardDetails> {
    const cardMethod =
      await this.paymentMethodRepository.createCardPaymentMethod(data);
    if (!cardMethod) {
      throw new BadRequestError({
        message: "Failed to create payment method",
        logging: true,
      });
    }
    return cardMethod;
  }

  async preparePayment(
    data: CreatePaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    const payment = await this.provider.createPaymentIntent(data);
    return payment;
  }

  async processPayment(
    data: ConfirmPaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    const payment = await this.provider.confirmPaymentIntent(data);
    return payment;
  }

  async refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
    const refund = await this.provider.refundPaymentIntent(paymentIntentId);
    return refund;
  }
}

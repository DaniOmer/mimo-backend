import Stripe from "stripe";
import PaymentStrategy from "./payment.strategy";
import {
  StripeProvider,
  CreatePaymentIntentParams,
  ConfirmPaymentIntentParams,
} from "../../../config/store";

export default class StripePayment implements PaymentStrategy {
  private provider: StripeProvider;

  constructor() {
    this.provider = new StripeProvider();
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

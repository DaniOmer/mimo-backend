import Stripe from "stripe";
import { AppConfig } from "../app.config";

export type CustomerParamsType = {
  firstName: string;
  lastName: string;
  email: string;
};

export enum PaymentCurrencyType {
  EUR = "eur",
  USD = "usd",
}

export type CardPaymentMethodParamsType = {
  type: string;
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billingDetails: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      postal_code: string;
      country: string;
    };
  };
};

export type CreatePaymentIntentParams = {
  amount: number;
  currency: PaymentCurrencyType;
  customer: string;
  paymentMethod?: string;
  receiptEmail?: string;
};

export type ConfirmPaymentIntentParams = {
  paymentIntentId: string;
  paymentMethods: string;
  returnUrl: string;
};

export class StripeProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(AppConfig.store.stripe.secretKey as string);
  }

  async createCustomer(params: CustomerParamsType): Promise<Stripe.Customer> {
    return await this.stripe.customers.create(params);
  }

  async getCustomer(
    customerId: string
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return await this.stripe.customers.retrieve(customerId);
  }

  async createPaymentMethod(
    params: Stripe.PaymentMethodCreateParams
  ): Promise<Stripe.PaymentMethod> {
    return await this.stripe.paymentMethods.create(params);
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      customer: params.customer,
      payment_method: params.paymentMethod,
      receipt_email: params.receiptEmail,
    });
  }

  async confirmPaymentIntent(
    params: ConfirmPaymentIntentParams
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.confirm(params.paymentIntentId, {
      payment_method: params.paymentMethods,
      return_url: params.returnUrl,
    });
  }

  async refundPaymentIntent(paymentIntent: string): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntent,
    });
  }
}

import PaymentStrategy from "./payment.strategy";
import { CardPayment } from "./payment.stripe";
import { PayPalPayment } from "./payment.paypal";
import BadRequestError from "../../../config/error/bad.request.config";

export enum PaymentStrategyType {
  CARD = "card",
  PAYPAL = "paypal",
  // Add more payment strategies here as needed
}

export class PaymentStrategyFactory {
  static create(strategy: string): PaymentStrategy {
    switch (strategy) {
      case PaymentStrategyType.CARD:
        return new CardPayment();
      case PaymentStrategyType.PAYPAL:
        return new PayPalPayment();
      default:
        throw new BadRequestError({
          message: "Invalid payment strategy",
          logging: true,
        });
    }
  }
}

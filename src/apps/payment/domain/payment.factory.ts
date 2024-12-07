import PaymentStrategy from "./payment.strategy";
import StripePayment from "./stripe.payment";
import PayPalPayment from "./paypal.payment";
import BadRequestError from "../../../config/error/bad.request.config";

export default class PaymentStrategyFactory {
  static create(strategy: string): PaymentStrategy {
    switch (strategy) {
      case "stripe":
        return new StripePayment();
      case "paypal":
        return new PayPalPayment();
      default:
        throw new BadRequestError({
          message: "Invalid payment strategy",
          logging: true,
        });
    }
  }
}

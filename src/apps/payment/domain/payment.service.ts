import PaymentStrategy from "./payment.strategy";
import { PaymentStrategyFactory, PaymentStrategyType } from "./payment.factory";
import { BaseService } from "../../../librairies/services";

export class PaymentService extends BaseService {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategyType) {
    super("Payment");
    this.strategy = PaymentStrategyFactory.create(strategy);
  }

  async addPaymentMethod(method: any) {
    return this.strategy.addPaymentMethod(method);
  }
}

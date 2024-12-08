import { IPaymentMethod } from "../data-access";
import PaymentStrategy from "./payment.strategy";
import { PaymentStrategyFactory, PaymentStrategyType } from "./payment.factory";
import { BaseService } from "../../../librairies/services";
import { PaymentMethodRepository } from "../data-access";

export class PaymentService extends BaseService {
  readonly strategy: PaymentStrategy;
  readonly paymentMethodRepository: PaymentMethodRepository;

  constructor(strategy: PaymentStrategyType) {
    super("Payment");
    this.paymentMethodRepository = new PaymentMethodRepository();
    this.strategy = PaymentStrategyFactory.create(strategy);
  }

  async getAllPaymentMethod(): Promise<IPaymentMethod[]> {
    return this.paymentMethodRepository.getAll();
  }

  async addPaymentMethod(method: any) {
    return this.strategy.addPaymentMethod(method);
  }
}

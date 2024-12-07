import PaymentStrategy from "./payment.strategy";

export default class PayPalPayment implements PaymentStrategy {
  async preparePayment(data: any): Promise<any> {
    throw new Error("This payment method is not implemented yet.");
  }

  async processPayment(data: any): Promise<any> {
    throw new Error("This payment method is not implemented yet.");
  }

  async refundPayment(data: any): Promise<any> {
    throw new Error("This payment method is not implemented yet.");
  }
}

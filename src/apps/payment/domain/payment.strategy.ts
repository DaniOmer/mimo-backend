export default interface PaymentStrategy {
  addPaymentMethod(data: any): Promise<any>;
  preparePayment(data: any): Promise<any>;
  processPayment(data: any): Promise<any>;
  refundPayment(data: any): Promise<any>;
}

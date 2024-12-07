export default interface PaymentStrategy {
  preparePayment(data: any): Promise<any>;
  processPayment(data: any): Promise<any>;
  refundPayment(data: any): Promise<any>;
}

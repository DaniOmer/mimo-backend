import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../librairies/controllers";
import { PaymentStrategyType, PaymentService } from "../domain";
import { ApiResponse } from "../../../librairies/controllers";

export class PaymentController extends BaseController {
  constructor() {
    super();
  }

  async getAllPaymentMethods(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const paymentService = new PaymentService(PaymentStrategyType.CARD);
      const paymentMethods = await paymentService.getAllPaymentMethod();
      ApiResponse.success(
        res,
        "Payment methods retrieved successfully",
        paymentMethods
      );
    } catch (error) {
      next(error);
    }
  }

  async addCardPaymentMethod(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const paymentService = new PaymentService(PaymentStrategyType.CARD);
      const paymentMethod = await paymentService.addPaymentMethod(req.body);
      ApiResponse.success(
        res,
        "Payment method added successfully",
        paymentMethod
      );
    } catch (error) {
      next(error);
    }
  }

  async prepareCardPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = {
        ...req.body,
        customer: req.user.stripe,
        receiptEmail: req.user.email,
      };
      const paymentService = new PaymentService(PaymentStrategyType.CARD);
      const paymentIntent = await paymentService.preparePayment(data);
      ApiResponse.success(
        res,
        "Payment intent prepared successfully",
        paymentIntent
      );
    } catch (error) {
      next(error);
    }
  }
}

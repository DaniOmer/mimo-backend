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
}

import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { CardMethodDTO } from "../domain/payment.dto";
import { validateDtoMiddleware } from "../../../librairies/middlewares";

const router = Router();
const paymentController = new PaymentController();

router.get(
  "/methods",
  paymentController.getAllPaymentMethods.bind(paymentController)
);

router.post(
  "/methods/card",
  validateDtoMiddleware(CardMethodDTO),
  paymentController.addCardPaymentMethod.bind(paymentController)
);

export default router;

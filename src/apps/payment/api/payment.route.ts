import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { CardMethodDTO } from "../domain/payment.dto";
import { validateDtoMiddleware } from "../../../librairies/middlewares";

const router = Router();
const paymentController = new PaymentController();

router.post(
  "/method/card",
  validateDtoMiddleware(CardMethodDTO),
  paymentController.addCardPaymentMethod.bind(paymentController)
);

export default router;

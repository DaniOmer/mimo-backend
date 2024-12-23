import { Router } from "express";
import { PaymentController } from "./payment.controller";

import { CardMethodDTO, CardPaymentIntentDTO } from "../domain/payment.dto";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
} from "../../../librairies/middlewares";


const router = Router();
const paymentController = new PaymentController();

router.get(
  "/methods",
  paymentController.getAllPaymentMethods.bind(paymentController)
);

router.post(
  "/methods/card",
  authenticateMiddleware,
  validateDtoMiddleware(CardMethodDTO),
  paymentController.addCardPaymentMethod.bind(paymentController)
);

router.post(
  "/intents/card",
  authenticateMiddleware,
  validateDtoMiddleware(CardPaymentIntentDTO),
  paymentController.prepareCardPayment.bind(paymentController)
);

export default router;

import { Router } from "express";
import { InvoiceController } from "./invoice.controller";
import { authenticateMiddleware } from "../../../librairies/middlewares";

const router = Router();
const controller = new InvoiceController();

router.get(
    "send/:id",
    authenticateMiddleware,
    controller.sendInvoiceEmail.bind(controller)
)

router.get(
    "generate-pdf/:id",
    authenticateMiddleware,
    controller.generateInvoicePDF.bind(controller)
)

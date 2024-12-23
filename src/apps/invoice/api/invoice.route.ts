import { Router } from "express";
import { InvoiceController } from "./invoice.controller";

const router = Router();
const controller = new InvoiceController();

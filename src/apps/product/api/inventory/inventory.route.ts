import { Router } from "express";
import { InventoryController } from "./inventory.controller";
import { AddProductInventoryDTO } from "../../domain/inventory/inventory.dto";
import {
  validateDtoMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";

const router = Router();
const controller = new InventoryController();

router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(AddProductInventoryDTO),
  controller.addProductInventory.bind(controller)
);

router.put(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(AddProductInventoryDTO),
  controller.updateProductInventory.bind(controller)
);

export default router;

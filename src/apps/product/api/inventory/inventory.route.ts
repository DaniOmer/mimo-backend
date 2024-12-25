import { Router } from "express";
import { InventoryController } from "./inventory.controller";
import {
  AddProductInventoryDTO,
  UpdateProductInventoryDTO,
  GetLowQuantityProductsDTO,
} from "../../domain/inventory/inventory.dto";
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
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(UpdateProductInventoryDTO),
  controller.updateProductInventory.bind(controller)
);

router.post(
  "/low-quantity",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(GetLowQuantityProductsDTO),
  controller.getProductByLowerThershold.bind(controller)
);

router.get(
  "/all",
  controller.getInventoriesWithProductAndVariant.bind(controller)
);

export default router;

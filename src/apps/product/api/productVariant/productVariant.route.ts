import { Router } from "express";
import { ProductVariantController } from "./productVariant.controller";
import {
  authenticateMiddleware,
  checkRoleMiddleware,
  validateDtoMiddleware,
  validateIdMiddleware,
} from "../../../../librairies/middlewares";
import {
  ProductVariantCreateDTO,
  ProductVariantUpdateDTO,
} from "../../domain/productVariant/productVariant.dto";

const productVariantController = new ProductVariantController();
const router = Router();

router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductVariantCreateDTO),
  productVariantController.createVariant.bind(productVariantController)
);

router.get(
  "/search",
  productVariantController.searchVariants.bind(productVariantController)
);

router.get(
  "/",
  productVariantController.getAllVariants.bind(productVariantController)
);

router.get(
  "/:id",
  validateIdMiddleware("ProductVariant"),
  productVariantController.getVariantById.bind(productVariantController)
);

router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  validateDtoMiddleware(ProductVariantUpdateDTO),
  productVariantController.updateVariantById.bind(productVariantController)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  productVariantController.deleteVariantById.bind(productVariantController)
);

router.get(
  "/limited-edition",
  productVariantController.getLimitedEditionVariants.bind(
    productVariantController
  )
);

router.post(
  "/:id/duplicate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  productVariantController.duplicateVariant.bind(productVariantController)
);

export default router;

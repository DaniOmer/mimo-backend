import { Router } from "express";
import { ProductFeatureController } from "./productFeature.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";
import { ProductFeatureCreateDTO , ProductFeatureUpdateDTO} from "../../domain";

const productFeatureController = new ProductFeatureController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductFeatures
 *   description: API for managing product features
 */

router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductFeatureCreateDTO),
  productFeatureController.create.bind(productFeatureController)
);

router.get("/",
   productFeatureController.getAll.bind(productFeatureController));

router.get(
  "/:id",
  validateIdMiddleware("ProductFeature"),
  productFeatureController.getById.bind(productFeatureController)
);

router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductFeature"),
  validateDtoMiddleware(ProductFeatureUpdateDTO),
  productFeatureController.updateById.bind(productFeatureController)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductFeature"),
  productFeatureController.deleteById.bind(productFeatureController)
);

export default router;

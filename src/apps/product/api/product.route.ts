import { Router } from "express";
import { ProductController } from "./product.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../librairies/middlewares/";
import { ProductDTO, ProductFilterDto, ProductUpdateDTO, ProductVariantCreateDTO, ProductVariantUpdateDTOWithId } from "../domain/";
const productController = new ProductController();
const router = Router();

router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductDTO),
  productController.createProduct.bind(productController)
);

router.get("/", productController.getAllProducts.bind(productController));

router.get(
  "/active",
  productController.getActiveProducts.bind(productController)
);

router.post(
  "/search",
  validateDtoMiddleware(ProductFilterDto),
  productController.searchProducts.bind(productController)
);

router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  validateDtoMiddleware(ProductUpdateDTO),
  productController.updateProduct.bind(productController)
);

router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.deleteProduct.bind(productController)
);

router.patch(
  "/:id/activate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.toggleProductActivation.bind(productController)
);

router.post(
  "/:id/duplicate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.duplicateProduct.bind(productController)
);

router.get(
  "/status",
  authenticateMiddleware,
  productController.getProductsByStatus.bind(productController)
);

router.post(
  "/:productId/images",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.addImagesToProduct.bind(productController)
);

router.delete(
  "/:productId/images/:imageId",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.removeImageFromProduct.bind(productController)
);

router.get(
  "/category/:categoryId",
  productController.getProductsByCategory.bind(productController)
);

router.get(
  "/feature/:featureId",
  productController.getProductsByFeature.bind(productController)
);

router.get(
  "/filters",
  productController.getProductFilters.bind(productController)
);

router.get(
  "/:id",
  validateIdMiddleware("Product"),
  productController.getProductById.bind(productController)
);

router.put(
  "/:id/with-variants",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.updateProductWithVariants.bind(productController)
);

router.post(
  "/with-variants",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  productController.createProductWithVariants.bind(productController)
);


export default router;

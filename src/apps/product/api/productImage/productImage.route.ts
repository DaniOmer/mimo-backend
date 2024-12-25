import { Router } from "express";
import { ProductImageController } from "./productImage.controller";
import { authenticateMiddleware, 
  validateDtoMiddleware, 
  checkRoleMiddleware,
  validateIdMiddleware } from "../../../../librairies/middlewares/";
import { ProductImageCreateDTO, ProductImageUpdateDTO } from "../../domain/";

const productImageController = new ProductImageController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductImages
 *   description: API for managing product images
 */

/**
 * @swagger
 * /api/product-images:
 *   post:
 *     summary: Create a new product image
 *     tags: [ProductImages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductImageCreateDTO'
 *     responses:
 *       201:
 *         description: Product image created successfully
 */
router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductImageCreateDTO),
  productImageController.createProductImage.bind(productImageController)
);

/**
 * @swagger
 * /api/product-images/{productId}:
 *   get:
 *     summary: Get all images for a product
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product images retrieved successfully
 */
router.get(
  "/:productId",
  authenticateMiddleware,
  productImageController.getImagesByProductId.bind(productImageController)
);

/**
 * @swagger
 * /api/product-images/{id}:
 *   put:
 *     summary: Update a product image by ID
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductImageUpdateDTO'
 *     responses:
 *       200:
 *         description: Product image updated successfully
 */
router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductImage"),
  validateDtoMiddleware(ProductImageUpdateDTO),
  productImageController.updateProductImageById.bind(productImageController)
);

/**
 * @swagger
 * /api/product-images/{id}:
 *   delete:
 *     summary: Delete a product image by ID
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product image deleted successfully
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductImage"),
  productImageController.deleteProductImageById.bind(productImageController)
);

export default router;

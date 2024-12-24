import { Router } from "express";
import { ProductVariantController } from "./productVariant.controller";
import {
  authenticateMiddleware,
  checkRoleMiddleware,
  validateDtoMiddleware,
  validateIdMiddleware,
} from "../../../../librairies/middlewares";
import { ProductVariantCreateDTO, ProductVariantUpdateDTO } from "../../domain/productVariant/productVariant.dto";

const productVariantController = new ProductVariantController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductVariants
 *   description: API for managing product variants
 */

/**
 * @swagger
 * /api/product-variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [ProductVariants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price_etx:
 *                 type: number
 *                 description: Excluding tax price of the product variant
 *                 example: 29.99
 *               price_vat:
 *                 type: number
 *                 description: Price including tax
 *                 example: 35.99
 *               quantity:
 *                 type: number
 *                 description: Available quantity
 *                 example: 100
 *               stripe_id:
 *                 type: string
 *                 description: Stripe unique identifier
 *                 example: "stripe_123456"
 *               product_id:
 *                 type: string
 *                 description: ID of the related product
 *                 example: "64bc6e5b2f8e4c0f8890a5a3"
 *               size_id:
 *                 type: string
 *                 description: ID of the related size
 *                 example: "64bc6e6c2f8e4c0f8890a5a4"
 *               color_id:
 *                 type: string
 *                 description: ID of the related color
 *                 example: "64bc6e7e2f8e4c0f8890a5a5"
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductVariantCreateDTO),
  productVariantController.createVariant.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants:
 *   get:
 *     summary: Get all product variants
 *     tags: [ProductVariants]
 *     responses:
 *       200:
 *         description: List of product variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */
router.get(
  "/",
  authenticateMiddleware,
  productVariantController.getAllVariants.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   get:
 *     summary: Get a product variant by ID
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product variant ID
 *     responses:
 *       200:
 *         description: Product variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product variant not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("ProductVariant"),
  productVariantController.getVariantById.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   put:
 *     summary: Update a product variant by ID
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product variant not found
 */
router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  validateDtoMiddleware(ProductVariantUpdateDTO),
  productVariantController.updateVariantById.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/{id}:
 *   delete:
 *     summary: Delete a product variant by ID
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product variant ID
 *     responses:
 *       204:
 *         description: Product variant deleted successfully
 *       404:
 *         description: Product variant not found
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  productVariantController.deleteVariantById.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/search:
 *   get:
 *     summary: Search product variants by criteria
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: ID of the product
 *       - in: query
 *         name: sizeId
 *         schema:
 *           type: string
 *         description: ID of the size
 *       - in: query
 *         name: colorId
 *         schema:
 *           type: string
 *         description: ID of the color
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
 */
router.get(
  "/search",
  authenticateMiddleware,
  productVariantController.searchVariants.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/limited-edition:
 *   get:
 *     summary: Get limited edition product variants
 *     tags: [ProductVariants]
 *     responses:
 *       200:
 *         description: Limited edition product variants retrieved successfully
 */
router.get(
  "/limited-edition",
  authenticateMiddleware,
  productVariantController.getLimitedEditionVariants.bind(productVariantController)
);

/**
 * @swagger
 * /api/product-variants/{id}/duplicate:
 *   post:
 *     summary: Duplicate a product variant
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product variant ID
 *     responses:
 *       201:
 *         description: Product variant duplicated successfully
 */
router.post(
  "/:id/duplicate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("ProductVariant"),
  productVariantController.duplicateVariant.bind(productVariantController)
);


export default router;

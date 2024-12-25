import { Router } from "express";
import { ProductController } from "./product.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware
} from "../../../librairies/middlewares/";
import { ProductCreateDTO, ProductUpdateDTO } from "../domain/";

const productController = new ProductController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: Artisan Bag
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: A handmade artisan bag.
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(ProductCreateDTO),
  productController.createProduct.bind(productController)
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/",
  authenticateMiddleware,
   productController.getAllProducts.bind(productController));

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by criteria
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Product name
 *       - in: query
 *         name: categoryIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Category IDs
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
 *         description: Products retrieved successfully
 */
router.get("/search", authenticateMiddleware, productController.searchProducts.bind(productController));


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Product"),
  productController.getProductById.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: Artisan Bag
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: A handmade artisan bag.
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  validateDtoMiddleware(ProductUpdateDTO),
  productController.updateProduct.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.deleteProduct.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}/activate:
 *   patch:
 *     summary: Activate or deactivate a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Whether the product is active
 *                 example: true
 *     responses:
 *       200:
 *         description: Product activation status updated
 */
router.patch(
  "/:id/activate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.toggleProductActivation.bind(productController)
);


/**
 * @swagger
 * /api/products/{id}/duplicate:
 *   post:
 *     summary: Duplicate a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       201:
 *         description: Product duplicated successfully
 */
router.post(
  "/:id/duplicate",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Product"),
  productController.duplicateProduct.bind(productController)
);

/**
 * @swagger
 * /api/products/status:
 *   get:
 *     summary: Get products by status
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Whether the product is active
 *         example: true
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/status", authenticateMiddleware, productController.getProductsByStatus.bind(productController));

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
  validateIdMiddleware("ProductImage"),
  productController.removeImageFromProduct.bind(productController)
);


export default router;


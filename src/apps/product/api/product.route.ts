import { Router } from "express";
import { ProductController } from "./product.controller";
import { validateDtoMiddleware } from "../../../librairies/middlewares/validation.middleware";
import { ProductCreateDTO } from "../domain/product.dto";

const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * Configure the Product routes.
 * @param {Router} router - The Express router instance.
 * @returns {Router} - The configured router with Product routes.
 */
export default (router: Router): Router => {
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
  router.get("/", productController.getAllProducts.bind(productController));

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
  router.get("/:id", productController.getProductById.bind(productController));

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
  router.put("/:id", productController.updateProduct.bind(productController));

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
  router.delete("/:id", productController.deleteProduct.bind(productController));

  return router;
};

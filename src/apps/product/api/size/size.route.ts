import { Router } from "express";
import { SizeController } from "./size.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
  authenticateMiddleware,
  checkRoleMiddleware,
} from "../../../../librairies/middlewares";
import { SizeCreateDTO, SizeUpdateDTO } from "../../domain/size/size.dto";

const sizeController = new SizeController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sizes
 *   description: API for managing sizes
 */

/**
 * @swagger
 * /api/sizes:
 *   post:
 *     summary: Create a new size
 *     tags: [Sizes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the size
 *                 example: Large
 *     responses:
 *       201:
 *         description: Size created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateDtoMiddleware(SizeCreateDTO),
  sizeController.createSize.bind(sizeController)
);

/**
 * @swagger
 * /api/sizes:
 *   get:
 *     summary: Get a list of all sizes
 *     tags: [Sizes]
 *     responses:
 *       200:
 *         description: List of sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Size'
 */
router.get("/", sizeController.getAllSizes.bind(sizeController));

/**
 * @swagger
 * /api/sizes/{id}:
 *   get:
 *     summary: Get a size by ID
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The size ID
 *     responses:
 *       200:
 *         description: Size data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
 */
router.get(
  "/:id",
  authenticateMiddleware,
  validateIdMiddleware("Size"),
  sizeController.getSizeById.bind(sizeController)
);

/**
 * @swagger
 * /api/sizes/{id}:
 *   put:
 *     summary: Update a size by ID
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The size ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the size
 *                 example: Medium
 *     responses:
 *       200:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
 */
router.put(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Size"),
  validateDtoMiddleware(SizeUpdateDTO),
  sizeController.updateSizeById.bind(sizeController)
);

/**
 * @swagger
 * /api/sizes/{id}:
 *   delete:
 *     summary: Delete a size by ID
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The size ID
 *     responses:
 *       204:
 *         description: Size deleted successfully
 *       404:
 *         description: Size not found
 */
router.delete(
  "/:id",
  authenticateMiddleware,
  checkRoleMiddleware(["admin"]),
  validateIdMiddleware("Size"),
  sizeController.deleteSizeById.bind(sizeController)
);

export default router;



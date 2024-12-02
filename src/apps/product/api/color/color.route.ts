import { Router } from "express";
import { ColorController } from "./color.controller";
import {
  validateDtoMiddleware,
  validateIdMiddleware,
} from "../../../../librairies/middlewares";
import { ColorCreateDTO, ColorUpdateDTO } from "../../domain/color/color.dto";

const colorController = new ColorController();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Colors
 *   description: API for managing colors
 */

/**
 * @swagger
 * /api/colors:
 *   post:
 *     summary: Create a new color
 *     tags: [Colors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the color
 *                 example: Red
 *     responses:
 *       201:
 *         description: Color created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validateDtoMiddleware(ColorCreateDTO),
  colorController.createColor.bind(colorController)
);

/**
 * @swagger
 * /api/colors:
 *   get:
 *     summary: Get a list of all colors
 *     tags: [Colors]
 *     responses:
 *       200:
 *         description: List of colors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 */
router.get("/", colorController.getAllColors.bind(colorController));

/**
 * @swagger
 * /api/colors/{id}:
 *   get:
 *     summary: Get a color by ID
 *     tags: [Colors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The color ID
 *     responses:
 *       200:
 *         description: Color data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       404:
 *         description: Color not found
 */
router.get(
  "/:id",
  validateIdMiddleware("Color"),
  colorController.getColorById.bind(colorController)
);

/**
 * @swagger
 * /api/colors/{id}:
 *   put:
 *     summary: Update a color by ID
 *     tags: [Colors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The color ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the color
 *                 example: Blue
 *     responses:
 *       200:
 *         description: Color updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       404:
 *         description: Color not found
 */
router.put(
  "/:id",
  validateIdMiddleware("Color"),
  validateDtoMiddleware(ColorUpdateDTO),
  colorController.updateColorById.bind(colorController)
);

/**
 * @swagger
 * /api/colors/{id}:
 *   delete:
 *     summary: Delete a color by ID
 *     tags: [Colors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The color ID
 *     responses:
 *       204:
 *         description: Color deleted successfully
 *       404:
 *         description: Color not found
 */
router.delete(
  "/:id",
  validateIdMiddleware("Color"),
  colorController.deleteColorById.bind(colorController)
);

export default router;

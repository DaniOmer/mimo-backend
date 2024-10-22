import express, { Express, Request, Response, Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", (req: Request, res: Response) => {
  try {
    res.json([
      { id: "1", name: "John Doe", email: "john.doe@example.com" },
      { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
    ]);
  } catch (error) {
    console.log(`Error retrieving users: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

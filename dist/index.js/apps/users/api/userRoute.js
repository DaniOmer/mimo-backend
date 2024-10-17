"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
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
router.get("/users", (req, res) => {
    try {
        res.json([
            { id: "1", name: "John Doe", email: "john.doe@example.com" },
            { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
        ]);
    }
    catch (error) {
        console.log(`Error retrieving users: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;

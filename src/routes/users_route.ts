import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import usersController from "../controllers/users_controller";

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: get user by id
 *     tags: [Users]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The user by id
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */

router.get(
  "/:id",
  authMiddleware,
  usersController.getById.bind(usersController)
);

export default router;

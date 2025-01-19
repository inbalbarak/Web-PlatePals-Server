import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import usersController from "../controllers/users_controller";

/**
 * @swagger
 * /comments/post/:id:
 *   get:
 *     summary: get comments by post id
 *     tags: [Comments]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The post's comments
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

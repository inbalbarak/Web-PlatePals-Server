import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import postsController from "../controllers/posts_controller";
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * /post/
 *   post:
 *     summary: create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       200:
 *         description: The new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 *   put:
 *     summary: update a post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, postsController.getAll.bind(postsController));

router.put("/", authMiddleware, postsController.update.bind(postsController));

router.post("/", authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /post/:id
 *   delete:
 *     summary: delete post by id
 *     tags: [Comments]
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The deleted post
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 *
 */
router.delete(
  "/:id",
  authMiddleware,
  postsController.delete.bind(postsController)
);

export default router;

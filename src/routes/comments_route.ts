import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import commentsController from "../controllers/comments_controller";

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
  "/post/:id",
  authMiddleware,
  commentsController.getByPostId.bind(commentsController)
);

/**
 * @swagger
 * /comments/:postId/user/:userId:
 *   get:
 *     summary: get comments on post of user
 *     tags: [Comments]
 *     parameters:
 *          - in: path
 *            name: postId
 *            schema:
 *              type: string
 *          - in: path
 *            name: userId
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         description: The user's comment on post
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */

router.get(
  "/post/:postId/user/:userId",
  authMiddleware,
  commentsController.getByPostIdUserId.bind(commentsController)
);

/**
 * @swagger
 * /comments/:
 *   post:
 *     summary: create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comments'
 *     responses:
 *       200:
 *         description: The new comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 *   put:
 *     summary: update a comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comments'
 *     responses:
 *       200:
 *         description: The updated comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

router.put(
  "/",
  authMiddleware,
  commentsController.update.bind(commentsController)
);

router.post(
  "/",
  authMiddleware,
  commentsController.create.bind(commentsController)
);

export default router;

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
 * /posts/:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: All posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       201:
 *         description: The new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a post
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
 *               $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 * /posts/ids:
 *   post:
 *     summary: get posts by by ids
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: post ids
 *     responses:
 *       200:
 *         description: posts by ids
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

router.get("/", authMiddleware, postsController.getAll.bind(postsController));

router.post(
  "/ids",
  authMiddleware,
  postsController.getByIds.bind(postsController)
);

router.put("/", authMiddleware, postsController.update.bind(postsController));

router.post("/", authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The deleted post
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 * /posts/author/{id}:
 *   get:
 *     summary: Get posts by author
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The posts written by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                   $ref: '#/components/schemas/Posts'
 */

router.get("/", authMiddleware, postsController.getAll.bind(postsController));

router.put("/", authMiddleware, postsController.update.bind(postsController));

router.post("/", authMiddleware, postsController.create.bind(postsController));

router.delete(
  "/:id",
  authMiddleware,
  postsController.delete.bind(postsController)
);

router.get(
  "/user/",
  authMiddleware,
  postsController.getByAuthor.bind(postsController)
);

export default router;

import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *    schemas:
 *      Posts:
 *         type: object
 *         required:
 *            - title
 *            - author
 *            - ingredients
 *            - instructions
 *          properties:
 *            title:
 *              type: string
 *              description: The post title
 *            author:
 *              type: string
 *              description: The username of the user that has created the post
 *            tags:
 *              type: string[]
 *              description: The post tag ids
 *            rating:
 *              type: number
 *              description: The post rating
 *            ingredients:
 *              type: string
 *              description: The post ingredients
 *            instructions:
 *              type: string
 *              description: The post instructions
 *          example:
 *            title: 'title example'
 *            author: 'usernameexample'
 *            tags: ['123','1234']
 *            rating: 4
 *            ingredients: 'post ingredients listing'
 *            instructions: 'post instructions'
 */

/**
 * @swagger
 * /post/:
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
 * /post/:id:
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
 */
router.delete(
  "/:id",
  authMiddleware,
  postsController.delete.bind(postsController)
);

export default router;

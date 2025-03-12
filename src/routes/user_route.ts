import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *    name: Users
 *    description: The Users API
 * /users/:
 *      put:
 *          summary: update user
 *          tags: [Users]
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              201:
 *                  description: The updated user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Users'
 * /users/:id:
 *      get:
 *          summary: get user by id
 *          tags: [Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: The user by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Users'
 * /users/:id/saved-posts:
 *   put:
 *     summary: Update Saved Posts
 *     tags: [Users]
 *     description: update user's saved posts
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: string
 *                   description: the post id
 *                 toSave:
 *                   type: boolean
 *                   description: is post for save or unsave
 *     responses:
 *       200:
 *         description: updates user's saved posts status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example:
 *                     {
 *                       "postId": "1234",
 *                       "toSave": true
 *                     }
 *       400:
 *         description: Invalid input data or request
 *       500:
 *         description: Internal server error
 */

router.get("/:id", usersController.getById.bind(usersController));

router.put("/", authMiddleware, usersController.update.bind(usersController));

router.put(
  "/:id/saved-posts",
  authMiddleware,
  usersController.updateSavedPosts.bind(usersController)
);

export default router;

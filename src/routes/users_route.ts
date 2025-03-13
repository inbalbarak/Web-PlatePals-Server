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
 */

router.get("/:id", usersController.getById.bind(usersController));

router.put("/", authMiddleware, usersController.update.bind(usersController));

export default router;

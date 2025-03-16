import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import tagsController from "../controllers/tags_controller";

/**
 * @swagger
 * tags:
 *    name: Tags
 *    description: The Tags API
 */

/**
 * @swagger
 * /tags/:
 *      get:
 *          summary: Get all tags
 *          tags: [Tags]
 *          responses:
 *              200:
 *                  description: all tags
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Tags'
 */

router.get("/", authMiddleware, tagsController.getAll.bind(tagsController));

export default router;

import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import tagsController from "../controllers/tags_controller";

/**
 * @swagger
 * tags:
 *    name: Tags
 *    description: The Tags API
 * components:
 *    schemas:
 *          Comments:
 *              type: object
 *              required:
 *                       - name
 *              properties:
 *                  name:
 *                      type: string
 *                      description: The tag name
 *              example:
 *                  name: 'tag name'
 * /tags/:
 *      get:
 *          summary: get all tags
 *          tags: [Tags]
 *          responses:
 *              200:
 *                  description: The tags
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Tags'
 */

router.get("/", authMiddleware, tagsController.getAll.bind(tagsController));

export default router;

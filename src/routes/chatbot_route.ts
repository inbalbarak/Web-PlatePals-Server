import express from "express";
const router = express.Router();
import { authMiddleware } from "../controllers/auth_controller";
import chatbotController from "../controllers/chatbot_controller";

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: The Chatbot API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           enum: [system, user, assistant]
 *           description: The role of the message sender
 *         content:
 *           type: string
 *           description: The text content of the message
 */

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: get bot response
 *     description: send messages to bot and get response
 *     tags:
 *       - Chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/Message"
 *     responses:
 *       200:
 *         description: Successfully get bot response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */

router.post(
  "/",
  authMiddleware,
  chatbotController.getBotResponse.bind(chatbotController)
);

export default router;

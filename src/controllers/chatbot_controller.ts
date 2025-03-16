import axios from "axios";
import { Request, Response } from "express";

const chatbotController = {
  getBotResponse: async (req: Request, res: Response) => {
    const messages = req.body;

    try {
      const { data } = await axios.post(
        process.env.CHATGPT_API_URL!,
        {
          model: "gpt-4o-mini",
          messages: messages,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const message = data?.choices?.[0]?.message;

      res.status(200).json({ message });
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      res.status(500).json({ error: "Failed to get response from ChatGPT" });
    }
  },
};

export default chatbotController;

import { Request, Response } from "express";

const chatbotController = {
  getBotResponse: async (req: Request, res: Response) => {
    const messages = req.body;

    try {
      const response = await fetch(process.env.CHATGPT_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data?.choices?.[0]?.message;

      res.status(200).json({ message });
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
      res.status(500).json({ error: "Failed to get response from ChatGPT" });
    }
  },
};

export default chatbotController;

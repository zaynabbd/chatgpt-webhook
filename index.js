const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  try {
    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const chatResponse = openaiRes.data.choices[0].message.content;

    return res.json({
      fulfillmentText: chatResponse,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.json({
      fulfillmentText:
        "Sorry, I'm having trouble reaching the assistant right now.",
    });
  }
});

app.listen(3000, () => {
  console.log("Webhook is running on port 3000");
});

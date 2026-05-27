const { fn } = require("../lib/utils");
const { GOOGLE_GEMMA_KEY, DEEPSEEK_API_URL } = require("../lib/local.env");
const { saveChatInteraction } = require("./chat.service");
exports.getDeepSeekResponse = fn(async (req, res) => {
  const { prompt } = req.body;
  try {
    const messages = [{ role: "user", content: prompt }];
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOGLE_GEMMA_KEY}`,
        "Content-Type": "application/json",
        // "HTTP-Referer": "http://localhost:3000",
        // "X-Title": "My Chatbot",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        // model: "google/gemma-2-9b-it:free",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    const data = await response.json();

    const content = data.choices[0].message.content;
    const finishReason = data.choices[0].finish_reason;
    await saveChatInteraction({
      prompt,
      response: content,
      tokens: data.usage?.total_tokens || 0,
      finish_reason: finishReason,
    });
    return res.status(200).json({ content });
  } catch (error) {
    if (error?.response?.status === 429) {
      const reset = error.response.headers["x-ratelimit-reset"];
      const resetDate = new Date(Number(reset));
      console.warn(
        "❌ Rate limit exceeded. Please try again after:",
        resetDate.toLocaleString()
      );
    }

    console.error("Error:", {
      message: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ error: "An error occurred while connecting to DeepSeek." });
  }
});
//user_id: user_2zBWhvhefToAUVjTYmiwBwaXwK6

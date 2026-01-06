export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, history } = req.body;

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ reply: "OpenRouter API key not set" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a calm, casual AI talking to someone in the room." },
          ...history,
          { role: "user", content: message }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "Error contacting OpenRouter API" });
  }
}
